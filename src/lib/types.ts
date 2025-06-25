export interface Project {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  status: string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  notes?: string;
  status: string;
  vertical_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyDTO {
  name: string;
  website?: string;
  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  notes?: string;
  status?: string;
  vertical_id?: string;
}

export interface UpdateCompanyDTO {
  name?: string;
  website?: string;
  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  notes?: string;
  status?: string;
  vertical_id?: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  title?: string;
  notes?: string;
  company_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  email: string;
  role?: string;
  organization_id?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserSession;
  error?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  isActive?: boolean;
}

export interface WizardStep {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  isValid?: boolean;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  company_id: string;
  status?: string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
}

// Simple proposal types
export interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Proposal {
  id: string;
  title: string;
  company_id: string;
  contact_id?: string;
  line_items: LineItem[];
  subtotal: number;
  tax: number;
  tax_rate: number;
  total: number;
  notes?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  proposal_number?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProposalDTO {
  title: string;
  company_id: string;
  contact_id?: string;
  line_items: Omit<LineItem, "id" | "total">[];
  tax_rate?: number;
  notes?: string;
}

// Missing types for wizard and services
export interface WizardFormData {
  [key: string]: any;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  category:
    | "hosting"
    | "web-development"
    | "design"
    | "marketing"
    | "consulting"
    | "maintenance";
  description: string;
  price: number;
  unit?: string;
  isCustom?: boolean;
}

// ==========================================
// CRM TYPES - Phase 1
// ==========================================

// Deal Pipeline Types
export interface Deal {
  id: string;
  company_id: string;
  primary_contact_id: string;
  name: string;
  description?: string;
  value: number;
  probability: number;
  stage:
    | "lead"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  expected_close_date?: string;
  actual_close_date?: string;
  lost_reason?: string;
  source?:
    | "website"
    | "referral"
    | "cold_outreach"
    | "marketing"
    | "existing_client"
    | "linkedin"
    | "conference";
  deal_data?: Record<string, any>;
  created_by: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDealDTO {
  company_id: string;
  primary_contact_id: string;
  name: string;
  description?: string;
  value: number;
  probability?: number;
  stage?: Deal["stage"];
  expected_close_date?: string;
  source?: Deal["source"];
  deal_data?: Record<string, any>;
  assigned_to?: string;
}

export interface UpdateDealDTO {
  name?: string;
  description?: string;
  value?: number;
  probability?: number;
  stage?: Deal["stage"];
  expected_close_date?: string;
  actual_close_date?: string;
  lost_reason?: string;
  deal_data?: Record<string, any>;
  assigned_to?: string;
}

export interface DealWithDetails extends Deal {
  company: Company;
  contact: Contact;
  assigned_user?: { id: string; email: string };
}

// Deal Activity Types
export interface DealActivity {
  id: string;
  deal_id: string;
  activity_type:
    | "call"
    | "email"
    | "meeting"
    | "demo"
    | "proposal_sent"
    | "contract_sent"
    | "follow_up"
    | "stage_change";
  subject: string;
  notes?: string;
  completed: boolean;
  due_date?: string;
  completed_date?: string;
  activity_data?: Record<string, any>;
  created_by: string;
  created_at: string;
}

export interface CreateDealActivityDTO {
  deal_id: string;
  activity_type: DealActivity["activity_type"];
  subject: string;
  notes?: string;
  due_date?: string;
  activity_data?: Record<string, any>;
}

// Contact Interaction Types
export interface ContactInteraction {
  id: string;
  contact_id: string;
  interaction_type:
    | "call"
    | "email"
    | "meeting"
    | "demo"
    | "proposal_sent"
    | "follow_up"
    | "linkedin";
  subject: string;
  notes?: string;
  outcome?: "positive" | "neutral" | "negative" | "follow_up_needed";
  next_action?: string;
  next_action_date?: string;
  duration_minutes?: number;
  interaction_data?: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInteractionDTO {
  contact_id: string;
  interaction_type: ContactInteraction["interaction_type"];
  subject: string;
  notes?: string;
  outcome?: ContactInteraction["outcome"];
  next_action?: string;
  next_action_date?: string;
  duration_minutes?: number;
  interaction_data?: Record<string, any>;
}

export interface UpdateInteractionDTO {
  interaction_type?: ContactInteraction["interaction_type"];
  subject?: string;
  notes?: string;
  outcome?: ContactInteraction["outcome"];
  next_action?: string;
  next_action_date?: string;
  duration_minutes?: number;
  interaction_data?: Record<string, any>;
}

export interface ContactInteractionWithDetails extends ContactInteraction {
  contact: Contact;
  created_by_user?: { id: string; email: string };
}

// Contact Relationship Types
export interface ContactRelationship {
  id: string;
  primary_contact_id: string;
  related_contact_id: string;
  relationship_type:
    | "reports_to"
    | "colleague"
    | "decision_maker"
    | "influencer"
    | "assistant";
  influence_level?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactRelationshipDTO {
  primary_contact_id: string;
  related_contact_id: string;
  relationship_type: ContactRelationship["relationship_type"];
  influence_level?: number;
  notes?: string;
}

// Lead Scoring Types
export interface LeadScore {
  id: string;
  contact_id: string;
  company_id: string;
  company_size_score: number;
  budget_score: number;
  authority_score: number;
  need_score: number;
  timeline_score: number;
  engagement_score: number;
  total_score: number;
  qualification_status: "hot" | "warm" | "cold" | "unqualified";
  score_breakdown?: Record<string, any>;
  last_calculated: string;
  notes?: string;
}

export interface CreateLeadScoreDTO {
  contact_id: string;
  company_id: string;
  company_size_score?: number;
  budget_score?: number;
  authority_score?: number;
  need_score?: number;
  timeline_score?: number;
  engagement_score?: number;
  qualification_status?: LeadScore["qualification_status"];
  score_breakdown?: Record<string, any>;
  notes?: string;
}

export interface UpdateLeadScoreDTO {
  company_size_score?: number;
  budget_score?: number;
  authority_score?: number;
  need_score?: number;
  timeline_score?: number;
  engagement_score?: number;
  qualification_status?: LeadScore["qualification_status"];
  score_breakdown?: Record<string, any>;
  notes?: string;
}

export interface LeadScoreWithDetails extends LeadScore {
  contact: Contact;
  company: Company;
}

// Pipeline Metrics Types
export interface PipelineMetrics {
  total_pipeline_value: number;
  weighted_pipeline_value: number;
  deals_by_stage: {
    [stage: string]: {
      count: number;
      total_value: number;
      avg_probability: number;
    };
  };
  conversion_rates: {
    lead_to_qualified: number;
    qualified_to_won: number;
  };
}

// API Response Types
export interface CRMResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// =====================================================================================
// PHASE 2: COMMUNICATION HUB & CLIENT PORTAL TYPES
// =====================================================================================

// Enhanced User Profile Types
export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  phone?: string;
  timezone: string;
  notification_preferences: Record<string, any>;
  is_client: boolean;
  is_team_member: boolean;
  company_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserProfileDTO {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  phone?: string;
  timezone?: string;
  notification_preferences?: Record<string, any>;
  is_client?: boolean;
  is_team_member?: boolean;
  company_id?: string;
}

export interface UpdateUserProfileDTO {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  timezone?: string;
  notification_preferences?: Record<string, any>;
}

// Client Portal Access Types
export interface ClientPortalAccess {
  id: string;
  user_id: string;
  company_id: string;
  access_level: "view" | "comment" | "edit" | "admin";
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface CreateClientPortalAccessDTO {
  user_id: string;
  company_id: string;
  access_level?: ClientPortalAccess["access_level"];
  granted_by: string;
  expires_at?: string;
}

export interface TeamCompanyAccess {
  id: string;
  team_member_id: string;
  company_id: string;
  role: "account_manager" | "developer" | "designer" | "admin";
  is_primary: boolean;
  created_at: string;
}

// Message Thread Types
export interface MessageThread {
  id: string;
  company_id: string;
  project_id?: string;
  thread_type: "general" | "project" | "support" | "billing";
  title: string;
  description?: string;
  is_archived: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageThreadDTO {
  company_id: string;
  project_id?: string;
  thread_type?: MessageThread["thread_type"];
  title: string;
  description?: string;
  created_by: string;
}

export interface UpdateMessageThreadDTO {
  title?: string;
  description?: string;
  is_archived?: boolean;
}

export interface MessageThreadWithDetails extends MessageThread {
  company: Company;
  project?: Project;
  created_by_user: UserProfile;
  last_message?: Message;
  unread_count?: number;
  participants?: UserProfile[];
}

// Message Types
export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  message_type: "text" | "image" | "document" | "proposal" | "system";
  content?: string;
  metadata: Record<string, any>;
  reply_to?: string;
  is_edited: boolean;
  edited_at?: string;
  is_deleted: boolean;
  deleted_at?: string;
  created_at: string;
}

export interface CreateMessageDTO {
  thread_id: string;
  sender_id: string;
  message_type?: Message["message_type"];
  content?: string;
  metadata?: Record<string, any>;
  reply_to?: string;
}

export interface UpdateMessageDTO {
  content?: string;
  metadata?: Record<string, any>;
  is_edited?: boolean;
}

export interface MessageWithDetails extends Message {
  sender: UserProfile;
  thread: MessageThread;
  reply_to_message?: Message;
  attachments?: MessageAttachment[];
  read_by?: MessageReadStatus[];
  reactions?: MessageReactionSummary[];
}

// Message Attachment Types
export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  thumbnail_path?: string;
  uploaded_by: string;
  created_at: string;
}

export interface CreateMessageAttachmentDTO {
  message_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  thumbnail_path?: string;
  uploaded_by: string;
}

// Message Read Status Types
export interface MessageReadStatus {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface CreateMessageReadStatusDTO {
  message_id: string;
  user_id: string;
}

// Message Reaction Types
export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: "👍" | "❤️" | "😂" | "😮" | "😢" | "👎";
  created_at: string;
}

export interface CreateMessageReactionDTO {
  message_id: string;
  user_id: string;
  reaction_type: MessageReaction["reaction_type"];
}

export interface MessageReactionSummary {
  reaction_type: MessageReaction["reaction_type"];
  count: number;
  users: UserProfile[];
  user_reacted: boolean;
}

// Typing Indicator Types
export interface TypingIndicator {
  id: string;
  thread_id: string;
  user_id: string;
  started_typing_at: string;
}

export interface CreateTypingIndicatorDTO {
  thread_id: string;
  user_id: string;
}

// Document Library Types
export interface DocumentLibrary {
  id: string;
  company_id: string;
  library_type: "shared" | "client_private" | "team_private";
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
}

export interface CreateDocumentLibraryDTO {
  company_id: string;
  library_type: DocumentLibrary["library_type"];
  name: string;
  description?: string;
  created_by: string;
}

// Document Types (Version 2 with enhanced features)
export interface DocumentV2 {
  id: string;
  library_id: string;
  parent_document_id?: string;
  name: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size: number;
  version_number: number;
  is_current_version: boolean;
  document_status: "draft" | "review" | "approved" | "archived";
  tags: string[];
  uploaded_by: string;
  approved_by?: string;
  approved_at?: string;
  expires_at?: string;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentV2DTO {
  library_id: string;
  parent_document_id?: string;
  name: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size: number;
  version_number?: number;
  document_status?: DocumentV2["document_status"];
  tags?: string[];
  uploaded_by: string;
  expires_at?: string;
}

export interface UpdateDocumentV2DTO {
  name?: string;
  description?: string;
  document_status?: DocumentV2["document_status"];
  tags?: string[];
  approved_by?: string;
  expires_at?: string;
}

export interface DocumentV2WithDetails extends DocumentV2 {
  library: DocumentLibrary;
  uploaded_by_user: UserProfile;
  approved_by_user?: UserProfile;
  parent_document?: DocumentV2;
  versions?: DocumentV2[];
  permissions?: DocumentPermission[];
  comments?: DocumentComment[];
}

// Document Permission Types
export interface DocumentPermission {
  id: string;
  document_id: string;
  user_id?: string;
  role?: string;
  permission_type: "view" | "download" | "comment" | "edit" | "delete";
  granted_by: string;
  granted_at: string;
  expires_at?: string;
}

export interface CreateDocumentPermissionDTO {
  document_id: string;
  user_id?: string;
  role?: string;
  permission_type: DocumentPermission["permission_type"];
  granted_by: string;
  expires_at?: string;
}

// Document Activity Types
export interface DocumentActivity {
  id: string;
  document_id: string;
  user_id: string;
  activity_type:
    | "uploaded"
    | "downloaded"
    | "viewed"
    | "edited"
    | "commented"
    | "approved"
    | "shared";
  metadata: Record<string, any>;
  created_at: string;
}

export interface CreateDocumentActivityDTO {
  document_id: string;
  user_id: string;
  activity_type: DocumentActivity["activity_type"];
  metadata?: Record<string, any>;
}

export interface DocumentActivityWithDetails extends DocumentActivity {
  document: DocumentV2;
  user: UserProfile;
}

// Document Comment Types
export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  comment_text: string;
  page_number?: number;
  position_x?: number;
  position_y?: number;
  is_resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface CreateDocumentCommentDTO {
  document_id: string;
  user_id: string;
  comment_text: string;
  page_number?: number;
  position_x?: number;
  position_y?: number;
}

export interface UpdateDocumentCommentDTO {
  comment_text?: string;
  is_resolved?: boolean;
  resolved_by?: string;
}

export interface DocumentCommentWithDetails extends DocumentComment {
  user: UserProfile;
  resolved_by_user?: UserProfile;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  notification_type:
    | "message"
    | "document_shared"
    | "document_commented"
    | "proposal_status"
    | "task_assigned";
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface CreateNotificationDTO {
  user_id: string;
  notification_type: Notification["notification_type"];
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
}

export interface UpdateNotificationDTO {
  is_read?: boolean;
}

// Activity Feed Types
export interface ActivityFeed {
  id: string;
  company_id: string;
  actor_id: string;
  activity_type: string;
  activity_data: Record<string, any>;
  is_visible_to_client: boolean;
  created_at: string;
}

export interface CreateActivityFeedDTO {
  company_id: string;
  actor_id: string;
  activity_type: string;
  activity_data: Record<string, any>;
  is_visible_to_client?: boolean;
}

export interface ActivityFeedWithDetails extends ActivityFeed {
  actor: UserProfile;
  company: Company;
}

// Client Authentication Types
export interface ClientInvite {
  id: string;
  email: string;
  company_id: string;
  access_level: ClientPortalAccess["access_level"];
  invite_token: string;
  status: "pending" | "accepted" | "expired";
}

export interface ClientProfileData {
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface CompanyAccess extends ClientPortalAccess {
  company: Company;
}

// Real-time Event Types
export interface RealtimeMessageEvent {
  type:
    | "message_sent"
    | "message_edited"
    | "message_deleted"
    | "typing_start"
    | "typing_stop"
    | "message_read";
  thread_id: string;
  message?: Message;
  user?: UserProfile;
  timestamp: string;
}

export interface RealtimeDocumentEvent {
  type:
    | "document_uploaded"
    | "document_commented"
    | "document_shared"
    | "document_approved";
  document_id: string;
  document?: DocumentV2;
  user?: UserProfile;
  timestamp: string;
}

// Permission Helper Types
export type Permission =
  | "view_messages"
  | "send_messages"
  | "view_shared_documents"
  | "upload_documents"
  | "view_private_documents"
  | "manage_team_documents"
  | "invite_clients"
  | "manage_client_access";

export type Role =
  | "client_view"
  | "client_edit"
  | "team_member"
  | "account_manager"
  | "admin";
