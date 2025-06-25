import { BaseService } from './BaseService';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
	DocumentV2,
	CreateDocumentV2DTO,
	UpdateDocumentV2DTO,
	DocumentV2WithDetails,
	DocumentLibrary,
	CreateDocumentLibraryDTO,
	DocumentPermission,
	CreateDocumentPermissionDTO,
	DocumentActivity,
	CreateDocumentActivityDTO,
	DocumentActivityWithDetails,
	DocumentComment,
	CreateDocumentCommentDTO,
	UpdateDocumentCommentDTO,
	DocumentCommentWithDetails,
	UserProfile
} from '$lib/types';

export class DocumentService extends BaseService<
	DocumentV2,
	CreateDocumentV2DTO,
	UpdateDocumentV2DTO
> {
	constructor(supabaseClient?: SupabaseClient) {
		super('tf_documents_v2', supabaseClient);
	}

	// =====================================================================================
	// DOCUMENT LIBRARY MANAGEMENT
	// =====================================================================================

	async createLibrary(dto: CreateDocumentLibraryDTO): Promise<DocumentLibrary> {
		const { data, error } = await this.supabase
			.from('tf_document_libraries')
			.insert({
				...dto,
				created_at: new Date().toISOString()
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to create document library: ${error.message}`);
		}

		return data;
	}

	async getCompanyLibraries(companyId: string): Promise<DocumentLibrary[]> {
		const { data, error } = await this.supabase
			.from('tf_document_libraries')
			.select('*')
			.eq('company_id', companyId)
			.order('created_at');

		if (error) {
			throw new Error(`Failed to fetch libraries: ${error.message}`);
		}

		return data;
	}

	async getLibraryById(libraryId: string): Promise<DocumentLibrary> {
		const { data, error } = await this.supabase
			.from('tf_document_libraries')
			.select('*')
			.eq('id', libraryId)
			.single();

		if (error) {
			throw new Error(`Failed to fetch library: ${error.message}`);
		}

		return data;
	}

	async ensureDefaultLibraries(companyId: string, createdBy: string): Promise<DocumentLibrary[]> {
		const defaultLibraries = [
			{
				company_id: companyId,
				library_type: 'shared' as const,
				name: 'Shared Documents',
				description: 'Documents accessible by both team and clients',
				created_by: createdBy
			},
			{
				company_id: companyId,
				library_type: 'client_private' as const,
				name: 'Client Private',
				description: 'Private documents for client access only',
				created_by: createdBy
			},
			{
				company_id: companyId,
				library_type: 'team_private' as const,
				name: 'Team Private',
				description: 'Internal team documents',
				created_by: createdBy
			}
		];

		const libraries = [];

		for (const libraryData of defaultLibraries) {
			// Check if library already exists
			const { data: existing } = await this.supabase
				.from('tf_document_libraries')
				.select('*')
				.eq('company_id', companyId)
				.eq('library_type', libraryData.library_type)
				.single();

			if (!existing) {
				const library = await this.createLibrary(libraryData);
				libraries.push(library);
			} else {
				libraries.push(existing);
			}
		}

		return libraries;
	}

	// =====================================================================================
	// DOCUMENT MANAGEMENT
	// =====================================================================================

	async uploadDocument(dto: CreateDocumentV2DTO): Promise<DocumentV2WithDetails> {
		// Create document record
		const document = await this.create({
			...dto,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		});

		// Log upload activity
		await this.logActivity({
			document_id: document.id,
			user_id: dto.uploaded_by,
			activity_type: 'uploaded',
			metadata: {
				file_name: dto.name,
				file_size: dto.file_size,
				file_type: dto.file_type
			}
		});

		// Return document with details
		return await this.getDocumentWithDetails(document.id);
	}

	async getLibraryDocuments(
		libraryId: string,
		options: {
			includeArchived?: boolean;
			tags?: string[];
			searchQuery?: string;
			limit?: number;
			offset?: number;
		} = {}
	): Promise<DocumentV2WithDetails[]> {
		const {
			includeArchived = false,
			tags,
			searchQuery,
			limit = 50,
			offset = 0
		} = options;

		let query = this.supabase
			.from('tf_documents_v2')
			.select(
				`
				*,
				library:tf_document_libraries(*),
				uploaded_by_user:tf_user_profiles!tf_documents_v2_uploaded_by_fkey(*),
				approved_by_user:tf_user_profiles!tf_documents_v2_approved_by_fkey(*)
			`
			)
			.eq('library_id', libraryId)
			.eq('is_current_version', true);

		if (!includeArchived) {
			query = query.neq('document_status', 'archived');
		}

		if (tags && tags.length > 0) {
			query = query.overlaps('tags', tags);
		}

		if (searchQuery) {
			query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
		}

		const { data, error } = await query
			.order('created_at', { ascending: false })
			.range(offset, offset + limit - 1);

		if (error) {
			throw new Error(`Failed to fetch documents: ${error.message}`);
		}

		return data;
	}

	async getDocumentWithDetails(documentId: string): Promise<DocumentV2WithDetails> {
		const { data, error } = await this.supabase
			.from('tf_documents_v2')
			.select(
				`
				*,
				library:tf_document_libraries(*),
				uploaded_by_user:tf_user_profiles!tf_documents_v2_uploaded_by_fkey(*),
				approved_by_user:tf_user_profiles!tf_documents_v2_approved_by_fkey(*),
				parent_document:tf_documents_v2!tf_documents_v2_parent_document_id_fkey(*)
			`
			)
			.eq('id', documentId)
			.single();

		if (error) {
			throw new Error(`Failed to fetch document: ${error.message}`);
		}

		// Get versions if this is the current version
		const versions = await this.getDocumentVersions(documentId);

		// Get permissions
		const permissions = await this.getDocumentPermissions(documentId);

		// Get recent comments
		const comments = await this.getDocumentComments(documentId);

		return {
			...data,
			versions,
			permissions,
			comments
		};
	}

	async getDocumentVersions(documentId: string): Promise<DocumentV2[]> {
		// Find the root document (no parent) or use the current document
		const { data: currentDoc } = await this.supabase
			.from('tf_documents_v2')
			.select('parent_document_id')
			.eq('id', documentId)
			.single();

		const rootId = currentDoc?.parent_document_id || documentId;

		const { data, error } = await this.supabase
			.from('tf_documents_v2')
			.select('*')
			.or(`id.eq.${rootId},parent_document_id.eq.${rootId}`)
			.order('version_number', { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch document versions: ${error.message}`);
		}

		return data;
	}

	async createNewVersion(
		parentDocumentId: string,
		dto: Omit<CreateDocumentV2DTO, 'parent_document_id' | 'version_number'>
	): Promise<DocumentV2> {
		// Get the current version number
		const { data: parent } = await this.supabase
			.from('tf_documents_v2')
			.select('version_number')
			.eq('id', parentDocumentId)
			.single();

		if (!parent) {
			throw new Error('Parent document not found');
		}

		// Mark current version as not current
		await this.supabase
			.from('tf_documents_v2')
			.update({ is_current_version: false })
			.eq('id', parentDocumentId);

		// Create new version
		const newVersion = await this.create({
			...dto,
			parent_document_id: parentDocumentId,
			version_number: parent.version_number + 1,
			is_current_version: true
		});

		// Log activity
		await this.logActivity({
			document_id: newVersion.id,
			user_id: dto.uploaded_by,
			activity_type: 'uploaded',
			metadata: {
				version_number: newVersion.version_number,
				parent_document_id: parentDocumentId
			}
		});

		return newVersion;
	}

	async updateDocumentStatus(
		documentId: string,
		status: DocumentV2['document_status'],
		approvedBy?: string
	): Promise<DocumentV2> {
		const updateData: Partial<UpdateDocumentV2DTO> = {
			document_status: status
		};

		if (status === 'approved' && approvedBy) {
			updateData.approved_by = approvedBy;
		}

		const document = await this.update(documentId, updateData);

		// Log activity
		await this.logActivity({
			document_id: documentId,
			user_id: approvedBy || document.uploaded_by,
			activity_type: 'approved',
			metadata: { status }
		});

		return document;
	}

	async downloadDocument(documentId: string, userId: string): Promise<DocumentV2> {
		// Increment download count
		const { data, error } = await this.supabase.rpc('increment_download_count', {
			document_uuid: documentId
		});

		if (error) {
			console.warn('Failed to increment download count:', error);
		}

		// Log download activity
		await this.logActivity({
			document_id: documentId,
			user_id: userId,
			activity_type: 'downloaded'
		});

		// Return document
		return await this.findById(documentId);
	}

	// =====================================================================================
	// DOCUMENT PERMISSIONS
	// =====================================================================================

	async grantPermission(dto: CreateDocumentPermissionDTO): Promise<DocumentPermission> {
		const { data, error } = await this.supabase
			.from('tf_document_permissions')
			.insert({
				...dto,
				granted_at: new Date().toISOString()
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to grant permission: ${error.message}`);
		}

		// Log activity
		await this.logActivity({
			document_id: dto.document_id,
			user_id: dto.granted_by,
			activity_type: 'shared',
			metadata: {
				permission_type: dto.permission_type,
				granted_to_user: dto.user_id,
				granted_to_role: dto.role
			}
		});

		return data;
	}

	async revokePermission(permissionId: string): Promise<void> {
		const { error } = await this.supabase
			.from('tf_document_permissions')
			.delete()
			.eq('id', permissionId);

		if (error) {
			throw new Error(`Failed to revoke permission: ${error.message}`);
		}
	}

	async getDocumentPermissions(documentId: string): Promise<DocumentPermission[]> {
		const { data, error } = await this.supabase
			.from('tf_document_permissions')
			.select('*')
			.eq('document_id', documentId)
			.order('granted_at');

		if (error) {
			throw new Error(`Failed to fetch permissions: ${error.message}`);
		}

		return data;
	}

	async checkUserPermission(
		documentId: string,
		userId: string,
		permissionType: DocumentPermission['permission_type']
	): Promise<boolean> {
		const { data, error } = await this.supabase
			.from('tf_document_permissions')
			.select('id')
			.eq('document_id', documentId)
			.eq('user_id', userId)
			.eq('permission_type', permissionType)
			.or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
			.single();

		if (error && error.code !== 'PGRST116') {
			console.warn('Error checking permission:', error);
		}

		return !!data;
	}

	// =====================================================================================
	// DOCUMENT COMMENTS & COLLABORATION
	// =====================================================================================

	async addComment(dto: CreateDocumentCommentDTO): Promise<DocumentCommentWithDetails> {
		const { data, error } = await this.supabase
			.from('tf_document_comments')
			.insert({
				...dto,
				created_at: new Date().toISOString()
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to add comment: ${error.message}`);
		}

		// Log activity
		await this.logActivity({
			document_id: dto.document_id,
			user_id: dto.user_id,
			activity_type: 'commented',
			metadata: {
				comment_text: dto.comment_text.substring(0, 100),
				page_number: dto.page_number
			}
		});

		// Return comment with user details
		return await this.getCommentWithDetails(data.id);
	}

	async updateComment(
		commentId: string,
		dto: UpdateDocumentCommentDTO
	): Promise<DocumentComment> {
		const { data, error } = await this.supabase
			.from('tf_document_comments')
			.update(dto)
			.eq('id', commentId)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to update comment: ${error.message}`);
		}

		return data;
	}

	async resolveComment(commentId: string, resolvedBy: string): Promise<DocumentComment> {
		return await this.updateComment(commentId, {
			is_resolved: true,
			resolved_by: resolvedBy
		});
	}

	async getDocumentComments(
		documentId: string,
		includeResolved = true
	): Promise<DocumentCommentWithDetails[]> {
		let query = this.supabase
			.from('tf_document_comments')
			.select(
				`
				*,
				user:tf_user_profiles!tf_document_comments_user_id_fkey(*),
				resolved_by_user:tf_user_profiles!tf_document_comments_resolved_by_fkey(*)
			`
			)
			.eq('document_id', documentId);

		if (!includeResolved) {
			query = query.eq('is_resolved', false);
		}

		const { data, error } = await query.order('created_at');

		if (error) {
			throw new Error(`Failed to fetch comments: ${error.message}`);
		}

		return data;
	}

	async getCommentWithDetails(commentId: string): Promise<DocumentCommentWithDetails> {
		const { data, error } = await this.supabase
			.from('tf_document_comments')
			.select(
				`
				*,
				user:tf_user_profiles!tf_document_comments_user_id_fkey(*),
				resolved_by_user:tf_user_profiles!tf_document_comments_resolved_by_fkey(*)
			`
			)
			.eq('id', commentId)
			.single();

		if (error) {
			throw new Error(`Failed to fetch comment: ${error.message}`);
		}

		return data;
	}

	// =====================================================================================
	// DOCUMENT ACTIVITY TRACKING
	// =====================================================================================

	async logActivity(dto: CreateDocumentActivityDTO): Promise<void> {
		try {
			await this.supabase.from('tf_document_activity').insert({
				...dto,
				created_at: new Date().toISOString()
			});
		} catch (error) {
			console.error('Failed to log document activity:', error);
			// Don't throw to avoid breaking main flows
		}
	}

	async getDocumentActivity(
		documentId: string,
		limit = 20
	): Promise<DocumentActivityWithDetails[]> {
		const { data, error } = await this.supabase
			.from('tf_document_activity')
			.select(
				`
				*,
				document:tf_documents_v2(*),
				user:tf_user_profiles(*)
			`
			)
			.eq('document_id', documentId)
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error) {
			throw new Error(`Failed to fetch document activity: ${error.message}`);
		}

		return data;
	}

	async getCompanyDocumentActivity(
		companyId: string,
		limit = 50
	): Promise<DocumentActivityWithDetails[]> {
		const { data, error } = await this.supabase
			.from('tf_document_activity')
			.select(
				`
				*,
				document:tf_documents_v2!inner(
					*,
					library:tf_document_libraries!inner(*)
				),
				user:tf_user_profiles(*)
			`
			)
			.eq('document.library.company_id', companyId)
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error) {
			throw new Error(`Failed to fetch company document activity: ${error.message}`);
		}

		return data;
	}

	// =====================================================================================
	// SEARCH & FILTERING
	// =====================================================================================

	async searchDocuments(
		companyId: string,
		query: string,
		options: {
			libraryTypes?: DocumentLibrary['library_type'][];
			tags?: string[];
			fileTypes?: string[];
			status?: DocumentV2['document_status'][];
			limit?: number;
		} = {}
	): Promise<DocumentV2WithDetails[]> {
		const { libraryTypes, tags, fileTypes, status, limit = 50 } = options;

		let dbQuery = this.supabase
			.from('tf_documents_v2')
			.select(
				`
				*,
				library:tf_document_libraries!inner(*),
				uploaded_by_user:tf_user_profiles!tf_documents_v2_uploaded_by_fkey(*),
				approved_by_user:tf_user_profiles!tf_documents_v2_approved_by_fkey(*)
			`
			)
			.eq('library.company_id', companyId)
			.eq('is_current_version', true)
			.or(`name.ilike.%${query}%,description.ilike.%${query}%`);

		if (libraryTypes && libraryTypes.length > 0) {
			dbQuery = dbQuery.in('library.library_type', libraryTypes);
		}

		if (tags && tags.length > 0) {
			dbQuery = dbQuery.overlaps('tags', tags);
		}

		if (fileTypes && fileTypes.length > 0) {
			dbQuery = dbQuery.in('file_type', fileTypes);
		}

		if (status && status.length > 0) {
			dbQuery = dbQuery.in('document_status', status);
		}

		const { data, error } = await dbQuery
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error) {
			throw new Error(`Failed to search documents: ${error.message}`);
		}

		return data;
	}

	async getDocumentsByTag(
		companyId: string,
		tag: string,
		limit = 20
	): Promise<DocumentV2WithDetails[]> {
		const { data, error } = await this.supabase
			.from('tf_documents_v2')
			.select(
				`
				*,
				library:tf_document_libraries!inner(*),
				uploaded_by_user:tf_user_profiles!tf_documents_v2_uploaded_by_fkey(*),
				approved_by_user:tf_user_profiles!tf_documents_v2_approved_by_fkey(*)
			`
			)
			.eq('library.company_id', companyId)
			.eq('is_current_version', true)
			.contains('tags', [tag])
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error) {
			throw new Error(`Failed to fetch documents by tag: ${error.message}`);
		}

		return data;
	}

	async getPopularTags(companyId: string, limit = 20): Promise<Array<{ tag: string; count: number }>> {
		// This would require a custom SQL function to aggregate tags
		// For now, return empty array
		return [];
	}

	// =====================================================================================
	// BULK OPERATIONS
	// =====================================================================================

	async bulkUpdateStatus(
		documentIds: string[],
		status: DocumentV2['document_status'],
		updatedBy: string
	): Promise<void> {
		const { error } = await this.supabase
			.from('tf_documents_v2')
			.update({
				document_status: status,
				...(status === 'approved' && { approved_by: updatedBy })
			})
			.in('id', documentIds);

		if (error) {
			throw new Error(`Failed to bulk update status: ${error.message}`);
		}

		// Log activities for each document
		for (const documentId of documentIds) {
			await this.logActivity({
				document_id: documentId,
				user_id: updatedBy,
				activity_type: 'approved',
				metadata: { status, bulk_operation: true }
			});
		}
	}

	async bulkDelete(documentIds: string[], deletedBy: string): Promise<void> {
		const { error } = await this.supabase
			.from('tf_documents_v2')
			.update({ document_status: 'archived' })
			.in('id', documentIds);

		if (error) {
			throw new Error(`Failed to bulk delete documents: ${error.message}`);
		}

		// Log activities
		for (const documentId of documentIds) {
			await this.logActivity({
				document_id: documentId,
				user_id: deletedBy,
				activity_type: 'archived',
				metadata: { bulk_operation: true }
			});
		}
	}
}