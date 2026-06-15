import { PagedResult } from '../paged-result';
import { Member } from './member';

export interface MemberListResponse extends PagedResult<Member> {
  activeMembers: number;
  pendingInvitations: number;
  maxUsers: number;
}
