import { BaseService } from './BaseService';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
	UserProfile,
	CreateUserProfileDTO,
	UpdateUserProfileDTO,
	ClientPortalAccess,
	CreateClientPortalAccessDTO,
	TeamCompanyAccess,
	ClientInvite,
	ClientProfileData,
	CompanyAccess,
	Company
} from '$lib/types';

export class ClientAuthService extends BaseService<
	UserProfile,
	CreateUserProfileDTO,
	UpdateUserProfileDTO
> {
	constructor(supabaseClient?: SupabaseClient) {
		super('tf_user_profiles', supabaseClient);
	}

	// =====================================================================================
	// CLIENT INVITATION SYSTEM
	// =====================================================================================

	async inviteClient(
		companyId: string,
		email: string,
		accessLevel: ClientPortalAccess['access_level'] = 'view',
		grantedBy: string
	): Promise<ClientInvite> {
		try {
			// Generate secure invitation token
			const inviteToken = crypto.randomUUID();

			// Create auth user (inactive until they accept)
			const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
				email,
				email_confirm: false,
				user_metadata: {
					company_id: companyId,
					access_level: accessLevel,
					invite_token: inviteToken,
					is_client: true,
					invitation_status: 'pending'
				}
			});

			if (authError) {
				throw new Error(`Failed to create client user: ${authError.message}`);
			}

			// Create client portal access record
			await this.supabase.from('tf_client_portal_access').insert({
				user_id: authUser.user.id,
				company_id: companyId,
				access_level: accessLevel,
				granted_by: grantedBy,
				granted_at: new Date().toISOString(),
				is_active: false // Will be activated when they accept
			});

			// Send invitation email
			await this.sendInvitationEmail(email, inviteToken, companyId);

			return {
				id: authUser.user.id,
				email,
				company_id: companyId,
				access_level: accessLevel,
				invite_token: inviteToken,
				status: 'pending'
			};
		} catch (error) {
			throw new Error(`Failed to invite client: ${error.message}`);
		}
	}

	async acceptInvitation(
		inviteToken: string,
		password: string,
		profileData: ClientProfileData
	): Promise<UserProfile> {
		try {
			// Find user by invite token
			const { data: users, error: searchError } = await this.supabase.auth.admin.listUsers();

			if (searchError) {
				throw new Error(`Failed to search users: ${searchError.message}`);
			}

			const user = users.users.find(
				(u) => u.user_metadata?.invite_token === inviteToken
			);

			if (!user || user.user_metadata?.invitation_status !== 'pending') {
				throw new Error('Invalid or expired invitation token');
			}

			// Update password and activate account
			const { error: updateError } = await this.supabase.auth.admin.updateUserById(user.id, {
				password,
				email_confirm: true,
				user_metadata: {
					...user.user_metadata,
					invite_token: null, // Clear token
					invitation_status: 'accepted'
				}
			});

			if (updateError) {
				throw new Error(`Failed to activate account: ${updateError.message}`);
			}

			// Create user profile
			const profile = await this.create({
				user_id: user.id,
				first_name: profileData.first_name,
				last_name: profileData.last_name,
				phone: profileData.phone,
				is_client: true,
				is_team_member: false,
				company_id: user.user_metadata.company_id,
				timezone: 'UTC',
				notification_preferences: {
					email_notifications: true,
					push_notifications: true,
					message_notifications: true
				}
			});

			// Activate their portal access
			await this.supabase
				.from('tf_client_portal_access')
				.update({ is_active: true })
				.eq('user_id', user.id)
				.eq('company_id', user.user_metadata.company_id);

			return profile;
		} catch (error) {
			throw new Error(`Failed to accept invitation: ${error.message}`);
		}
	}

	async resendInvitation(userId: string): Promise<void> {
		try {
			// Get user data
			const { data: user, error } = await this.supabase.auth.admin.getUserById(userId);

			if (error || !user.user) {
				throw new Error('User not found');
			}

			if (user.user.user_metadata?.invitation_status !== 'pending') {
				throw new Error('User invitation is not pending');
			}

			// Generate new token
			const newToken = crypto.randomUUID();

			// Update user metadata
			await this.supabase.auth.admin.updateUserById(userId, {
				user_metadata: {
					...user.user.user_metadata,
					invite_token: newToken
				}
			});

			// Resend email
			await this.sendInvitationEmail(
				user.user.email!,
				newToken,
				user.user.user_metadata.company_id
			);
		} catch (error) {
			throw new Error(`Failed to resend invitation: ${error.message}`);
		}
	}

	async revokeInvitation(userId: string): Promise<void> {
		try {
			// Deactivate portal access
			await this.supabase
				.from('tf_client_portal_access')
				.update({ is_active: false })
				.eq('user_id', userId);

			// Update user metadata
			await this.supabase.auth.admin.updateUserById(userId, {
				user_metadata: {
					invitation_status: 'revoked',
					invite_token: null
				}
			});
		} catch (error) {
			throw new Error(`Failed to revoke invitation: ${error.message}`);
		}
	}

	// =====================================================================================
	// CLIENT PORTAL ACCESS MANAGEMENT
	// =====================================================================================

	async getClientCompanies(userId: string): Promise<CompanyAccess[]> {
		const { data, error } = await this.supabase
			.from('tf_client_portal_access')
			.select(
				`
				*,
				company:tf_companies(*)
			`
			)
			.eq('user_id', userId)
			.eq('is_active', true);

		if (error) {
			throw new Error(`Failed to fetch client companies: ${error.message}`);
		}

		return data;
	}

	async updateClientAccess(
		userId: string,
		companyId: string,
		accessLevel: ClientPortalAccess['access_level'],
		updatedBy: string
	): Promise<ClientPortalAccess> {
		const { data, error } = await this.supabase
			.from('tf_client_portal_access')
			.update({
				access_level: accessLevel,
				granted_by: updatedBy,
				granted_at: new Date().toISOString()
			})
			.eq('user_id', userId)
			.eq('company_id', companyId)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to update client access: ${error.message}`);
		}

		return data;
	}

	async getCompanyClients(companyId: string): Promise<Array<UserProfile & ClientPortalAccess>> {
		const { data, error } = await this.supabase
			.from('tf_client_portal_access')
			.select(
				`
				*,
				user:tf_user_profiles!tf_client_portal_access_user_id_fkey(*)
			`
			)
			.eq('company_id', companyId)
			.eq('is_active', true);

		if (error) {
			throw new Error(`Failed to fetch company clients: ${error.message}`);
		}

		return data.map((access) => ({
			...access.user,
			...access
		}));
	}

	async removeClientAccess(userId: string, companyId: string): Promise<void> {
		const { error } = await this.supabase
			.from('tf_client_portal_access')
			.update({ is_active: false })
			.eq('user_id', userId)
			.eq('company_id', companyId);

		if (error) {
			throw new Error(`Failed to remove client access: ${error.message}`);
		}
	}

	// =====================================================================================
	// TEAM MEMBER MANAGEMENT
	// =====================================================================================

	async assignTeamToCompany(
		teamMemberId: string,
		companyId: string,
		role: TeamCompanyAccess['role'],
		isPrimary = false
	): Promise<TeamCompanyAccess> {
		// If setting as primary, unset other primary assignments for this company
		if (isPrimary) {
			await this.supabase
				.from('tf_team_company_access')
				.update({ is_primary: false })
				.eq('company_id', companyId);
		}

		const { data, error } = await this.supabase
			.from('tf_team_company_access')
			.upsert(
				{
					team_member_id: teamMemberId,
					company_id: companyId,
					role,
					is_primary: isPrimary,
					created_at: new Date().toISOString()
				},
				{ onConflict: 'team_member_id,company_id' }
			)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to assign team member: ${error.message}`);
		}

		return data;
	}

	async getTeamCompanies(teamMemberId: string): Promise<Array<Company & TeamCompanyAccess>> {
		const { data, error } = await this.supabase
			.from('tf_team_company_access')
			.select(
				`
				*,
				company:tf_companies(*)
			`
			)
			.eq('team_member_id', teamMemberId);

		if (error) {
			throw new Error(`Failed to fetch team companies: ${error.message}`);
		}

		return data.map((access) => ({
			...access.company,
			...access
		}));
	}

	async getCompanyTeam(companyId: string): Promise<Array<UserProfile & TeamCompanyAccess>> {
		const { data, error } = await this.supabase
			.from('tf_team_company_access')
			.select(
				`
				*,
				team_member:tf_user_profiles!tf_team_company_access_team_member_id_fkey(*)
			`
			)
			.eq('company_id', companyId);

		if (error) {
			throw new Error(`Failed to fetch company team: ${error.message}`);
		}

		return data.map((access) => ({
			...access.team_member,
			...access
		}));
	}

	// =====================================================================================
	// USER PROFILE MANAGEMENT
	// =====================================================================================

	async getUserProfile(userId: string): Promise<UserProfile | null> {
		try {
			return await this.findById(userId);
		} catch {
			return null;
		}
	}

	async createOrUpdateProfile(userId: string, profileData: Partial<CreateUserProfileDTO>): Promise<UserProfile> {
		const existingProfile = await this.getUserProfile(userId);

		if (existingProfile) {
			return await this.update(existingProfile.id, profileData);
		} else {
			return await this.create({
				user_id: userId,
				first_name: profileData.first_name || '',
				last_name: profileData.last_name || '',
				...profileData
			});
		}
	}

	async updateNotificationPreferences(
		userId: string,
		preferences: Record<string, any>
	): Promise<UserProfile> {
		const profile = await this.findWhere({ user_id: userId });

		if (!profile.length) {
			throw new Error('User profile not found');
		}

		return await this.update(profile[0].id, {
			notification_preferences: preferences
		});
	}

	// =====================================================================================
	// PERMISSION HELPERS
	// =====================================================================================

	async hasCompanyAccess(userId: string, companyId: string): Promise<boolean> {
		// Check client access
		const { data: clientAccess } = await this.supabase
			.from('tf_client_portal_access')
			.select('id')
			.eq('user_id', userId)
			.eq('company_id', companyId)
			.eq('is_active', true)
			.single();

		if (clientAccess) return true;

		// Check team access
		const { data: teamAccess } = await this.supabase
			.from('tf_team_company_access')
			.select('id')
			.eq('team_member_id', userId)
			.eq('company_id', companyId)
			.single();

		return !!teamAccess;
	}

	async getAccessLevel(userId: string, companyId: string): Promise<ClientPortalAccess['access_level'] | TeamCompanyAccess['role'] | null> {
		// Check client access first
		const { data: clientAccess } = await this.supabase
			.from('tf_client_portal_access')
			.select('access_level')
			.eq('user_id', userId)
			.eq('company_id', companyId)
			.eq('is_active', true)
			.single();

		if (clientAccess) return clientAccess.access_level;

		// Check team access
		const { data: teamAccess } = await this.supabase
			.from('tf_team_company_access')
			.select('role')
			.eq('team_member_id', userId)
			.eq('company_id', companyId)
			.single();

		return teamAccess?.role || null;
	}

	// =====================================================================================
	// EMAIL INTEGRATION
	// =====================================================================================

	private async sendInvitationEmail(
		email: string,
		token: string,
		companyId: string
	): Promise<void> {
		try {
			// Get company info for personalized email
			const { data: company } = await this.supabase
				.from('tf_companies')
				.select('name')
				.eq('id', companyId)
				.single();

			const inviteUrl = `${process.env.PUBLIC_SITE_URL}/client/accept-invite?token=${token}`;

			// For now, we'll log the invitation details
			// In production, integrate with SendGrid, Mailgun, or similar
			console.log('=== CLIENT INVITATION EMAIL ===');
			console.log(`To: ${email}`);
			console.log(`Company: ${company?.name || 'Unknown'}`);
			console.log(`Invitation URL: ${inviteUrl}`);
			console.log('================================');

			// TODO: Implement actual email sending
			// await this.emailService.send({
			//   to: email,
			//   template: 'client_invitation',
			//   data: {
			//     invite_url: inviteUrl,
			//     company_name: company?.name || 'Your Client Portal'
			//   }
			// });
		} catch (error) {
			console.error('Failed to send invitation email:', error);
			// Don't throw here to avoid breaking the invitation flow
		}
	}

	// =====================================================================================
	// ACTIVITY TRACKING
	// =====================================================================================

	async logClientActivity(
		userId: string,
		companyId: string,
		activityType: string,
		activityData: Record<string, any>
	): Promise<void> {
		try {
			await this.supabase.from('tf_activity_feed').insert({
				company_id: companyId,
				actor_id: userId,
				activity_type: activityType,
				activity_data: activityData,
				is_visible_to_client: true,
				created_at: new Date().toISOString()
			});
		} catch (error) {
			console.error('Failed to log client activity:', error);
			// Don't throw to avoid breaking main flows
		}
	}

	// =====================================================================================
	// BULK OPERATIONS
	// =====================================================================================

	async inviteMultipleClients(
		companyId: string,
		invitations: Array<{
			email: string;
			access_level?: ClientPortalAccess['access_level'];
		}>,
		grantedBy: string
	): Promise<ClientInvite[]> {
		const results = [];

		for (const invitation of invitations) {
			try {
				const result = await this.inviteClient(
					companyId,
					invitation.email,
					invitation.access_level || 'view',
					grantedBy
				);
				results.push(result);
			} catch (error) {
				console.error(`Failed to invite ${invitation.email}:`, error);
				// Continue with other invitations
			}
		}

		return results;
	}

	async getInvitationStatus(companyId: string): Promise<Array<{
		email: string;
		status: 'pending' | 'accepted' | 'expired' | 'revoked';
		invited_at: string;
		access_level: ClientPortalAccess['access_level'];
	}>> {
		// This would require joining with auth.users which isn't directly accessible
		// In practice, you'd maintain invitation status in a separate table
		// For now, return empty array
		return [];
	}
}