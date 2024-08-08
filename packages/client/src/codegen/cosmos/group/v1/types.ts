//@ts-nocheck
import { Timestamp } from "../../../google/protobuf/timestamp";
import { Duration, DurationAmino, DurationSDKType } from "../../../google/protobuf/duration";
import { Any, AnyAmino, AnySDKType } from "../../../google/protobuf/any";
import { Long, toTimestamp, fromTimestamp, isSet, fromJsonTimestamp } from "../../../helpers";
import * as _m0 from "protobufjs/minimal";
import { JsonSafe } from "../../../json-safe";
/** VoteOption enumerates the valid vote options for a given proposal. */
export enum VoteOption {
  /**
   * VOTE_OPTION_UNSPECIFIED - VOTE_OPTION_UNSPECIFIED defines an unspecified vote option which will
   * return an error.
   */
  VOTE_OPTION_UNSPECIFIED = 0,
  /** VOTE_OPTION_YES - VOTE_OPTION_YES defines a yes vote option. */
  VOTE_OPTION_YES = 1,
  /** VOTE_OPTION_ABSTAIN - VOTE_OPTION_ABSTAIN defines an abstain vote option. */
  VOTE_OPTION_ABSTAIN = 2,
  /** VOTE_OPTION_NO - VOTE_OPTION_NO defines a no vote option. */
  VOTE_OPTION_NO = 3,
  /** VOTE_OPTION_NO_WITH_VETO - VOTE_OPTION_NO_WITH_VETO defines a no with veto vote option. */
  VOTE_OPTION_NO_WITH_VETO = 4,
  UNRECOGNIZED = -1,
}
export const VoteOptionSDKType = VoteOption;
export const VoteOptionAmino = VoteOption;
export function voteOptionFromJSON(object: any): VoteOption {
  switch (object) {
    case 0:
    case "VOTE_OPTION_UNSPECIFIED":
      return VoteOption.VOTE_OPTION_UNSPECIFIED;
    case 1:
    case "VOTE_OPTION_YES":
      return VoteOption.VOTE_OPTION_YES;
    case 2:
    case "VOTE_OPTION_ABSTAIN":
      return VoteOption.VOTE_OPTION_ABSTAIN;
    case 3:
    case "VOTE_OPTION_NO":
      return VoteOption.VOTE_OPTION_NO;
    case 4:
    case "VOTE_OPTION_NO_WITH_VETO":
      return VoteOption.VOTE_OPTION_NO_WITH_VETO;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VoteOption.UNRECOGNIZED;
  }
}
export function voteOptionToJSON(object: VoteOption): string {
  switch (object) {
    case VoteOption.VOTE_OPTION_UNSPECIFIED:
      return "VOTE_OPTION_UNSPECIFIED";
    case VoteOption.VOTE_OPTION_YES:
      return "VOTE_OPTION_YES";
    case VoteOption.VOTE_OPTION_ABSTAIN:
      return "VOTE_OPTION_ABSTAIN";
    case VoteOption.VOTE_OPTION_NO:
      return "VOTE_OPTION_NO";
    case VoteOption.VOTE_OPTION_NO_WITH_VETO:
      return "VOTE_OPTION_NO_WITH_VETO";
    case VoteOption.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
/** ProposalStatus defines proposal statuses. */
export enum ProposalStatus {
  /** PROPOSAL_STATUS_UNSPECIFIED - An empty value is invalid and not allowed. */
  PROPOSAL_STATUS_UNSPECIFIED = 0,
  /** PROPOSAL_STATUS_SUBMITTED - Initial status of a proposal when submitted. */
  PROPOSAL_STATUS_SUBMITTED = 1,
  /**
   * PROPOSAL_STATUS_ACCEPTED - Final status of a proposal when the final tally is done and the outcome
   * passes the group policy's decision policy.
   */
  PROPOSAL_STATUS_ACCEPTED = 2,
  /**
   * PROPOSAL_STATUS_REJECTED - Final status of a proposal when the final tally is done and the outcome
   * is rejected by the group policy's decision policy.
   */
  PROPOSAL_STATUS_REJECTED = 3,
  /**
   * PROPOSAL_STATUS_ABORTED - Final status of a proposal when the group policy is modified before the
   * final tally.
   */
  PROPOSAL_STATUS_ABORTED = 4,
  /**
   * PROPOSAL_STATUS_WITHDRAWN - A proposal can be withdrawn before the voting start time by the owner.
   * When this happens the final status is Withdrawn.
   */
  PROPOSAL_STATUS_WITHDRAWN = 5,
  UNRECOGNIZED = -1,
}
export const ProposalStatusSDKType = ProposalStatus;
export const ProposalStatusAmino = ProposalStatus;
export function proposalStatusFromJSON(object: any): ProposalStatus {
  switch (object) {
    case 0:
    case "PROPOSAL_STATUS_UNSPECIFIED":
      return ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED;
    case 1:
    case "PROPOSAL_STATUS_SUBMITTED":
      return ProposalStatus.PROPOSAL_STATUS_SUBMITTED;
    case 2:
    case "PROPOSAL_STATUS_ACCEPTED":
      return ProposalStatus.PROPOSAL_STATUS_ACCEPTED;
    case 3:
    case "PROPOSAL_STATUS_REJECTED":
      return ProposalStatus.PROPOSAL_STATUS_REJECTED;
    case 4:
    case "PROPOSAL_STATUS_ABORTED":
      return ProposalStatus.PROPOSAL_STATUS_ABORTED;
    case 5:
    case "PROPOSAL_STATUS_WITHDRAWN":
      return ProposalStatus.PROPOSAL_STATUS_WITHDRAWN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ProposalStatus.UNRECOGNIZED;
  }
}
export function proposalStatusToJSON(object: ProposalStatus): string {
  switch (object) {
    case ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED:
      return "PROPOSAL_STATUS_UNSPECIFIED";
    case ProposalStatus.PROPOSAL_STATUS_SUBMITTED:
      return "PROPOSAL_STATUS_SUBMITTED";
    case ProposalStatus.PROPOSAL_STATUS_ACCEPTED:
      return "PROPOSAL_STATUS_ACCEPTED";
    case ProposalStatus.PROPOSAL_STATUS_REJECTED:
      return "PROPOSAL_STATUS_REJECTED";
    case ProposalStatus.PROPOSAL_STATUS_ABORTED:
      return "PROPOSAL_STATUS_ABORTED";
    case ProposalStatus.PROPOSAL_STATUS_WITHDRAWN:
      return "PROPOSAL_STATUS_WITHDRAWN";
    case ProposalStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
/** ProposalExecutorResult defines types of proposal executor results. */
export enum ProposalExecutorResult {
  /** PROPOSAL_EXECUTOR_RESULT_UNSPECIFIED - An empty value is not allowed. */
  PROPOSAL_EXECUTOR_RESULT_UNSPECIFIED = 0,
  /** PROPOSAL_EXECUTOR_RESULT_NOT_RUN - We have not yet run the executor. */
  PROPOSAL_EXECUTOR_RESULT_NOT_RUN = 1,
  /** PROPOSAL_EXECUTOR_RESULT_SUCCESS - The executor was successful and proposed action updated state. */
  PROPOSAL_EXECUTOR_RESULT_SUCCESS = 2,
  /** PROPOSAL_EXECUTOR_RESULT_FAILURE - The executor returned an error and proposed action didn't update state. */
  PROPOSAL_EXECUTOR_RESULT_FAILURE = 3,
  UNRECOGNIZED = -1,
}
export const ProposalExecutorResultSDKType = ProposalExecutorResult;
export const ProposalExecutorResultAmino = ProposalExecutorResult;
export function proposalExecutorResultFromJSON(object: any): ProposalExecutorResult {
  switch (object) {
    case 0:
    case "PROPOSAL_EXECUTOR_RESULT_UNSPECIFIED":
      return ProposalExecutorResult.PROPOSAL_EXECUTOR_RESULT_UNSPECIFIED;
    case 1:
    case "PROPOSAL_EXECUTOR_RESULT_NOT_RUN":
      return ProposalExecutorResult.PROPOSAL_EXECUTOR_RESULT_NOT_RUN;
    case 2:
    case "PROPOSAL_EXECUTOR_RESULT_SUCCESS":
      return ProposalExecutorResult.PROPOSAL_EXECUTOR_RESULT_SUCCESS;
    case 3:
    case "PROPOSAL_EXECUTOR_RESULT_FAILURE":
      return ProposalExecutorResult.PROPOSAL_EXECUTOR_RESULT_FAILURE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ProposalExecutorResult.UNRECOGNIZED;
  }
}
export function proposalExecutorResultToJSON(object: ProposalExecutorResult): string {
  switch (object) {
    case ProposalExecutorResult.PROPOSAL_EXECUTOR_RESULT_UNSPECIFIED:
      return "PROPOSAL_EXECUTOR_RESULT_UNSPECIFIED";
    case ProposalExecutorResult.PROPOSAL_EXECUTOR_RESULT_NOT_RUN:
      return "PROPOSAL_EXECUTOR_RESULT_NOT_RUN";
    case ProposalExecutorResult.PROPOSAL_EXECUTOR_RESULT_SUCCESS:
      return "PROPOSAL_EXECUTOR_RESULT_SUCCESS";
    case ProposalExecutorResult.PROPOSAL_EXECUTOR_RESULT_FAILURE:
      return "PROPOSAL_EXECUTOR_RESULT_FAILURE";
    case ProposalExecutorResult.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
/**
 * Member represents a group member with an account address,
 * non-zero weight, metadata and added_at timestamp.
 */
export interface Member {
  /** address is the member's account address. */
  address: string;
  /** weight is the member's voting weight that should be greater than 0. */
  weight: string;
  /** metadata is any arbitrary metadata attached to the member. */
  metadata: string;
  /** added_at is a timestamp specifying when a member was added. */
  addedAt: Date;
}
export interface MemberProtoMsg {
  typeUrl: "/cosmos.group.v1.Member";
  value: Uint8Array;
}
/**
 * Member represents a group member with an account address,
 * non-zero weight, metadata and added_at timestamp.
 */
export interface MemberAmino {
  /** address is the member's account address. */
  address?: string;
  /** weight is the member's voting weight that should be greater than 0. */
  weight?: string;
  /** metadata is any arbitrary metadata attached to the member. */
  metadata?: string;
  /** added_at is a timestamp specifying when a member was added. */
  added_at: string;
}
export interface MemberAminoMsg {
  type: "cosmos-sdk/Member";
  value: MemberAmino;
}
/**
 * Member represents a group member with an account address,
 * non-zero weight, metadata and added_at timestamp.
 */
export interface MemberSDKType {
  address: string;
  weight: string;
  metadata: string;
  added_at: Date;
}
/**
 * MemberRequest represents a group member to be used in Msg server requests.
 * Contrary to `Member`, it doesn't have any `added_at` field
 * since this field cannot be set as part of requests.
 */
export interface MemberRequest {
  /** address is the member's account address. */
  address: string;
  /** weight is the member's voting weight that should be greater than 0. */
  weight: string;
  /** metadata is any arbitrary metadata attached to the member. */
  metadata: string;
}
export interface MemberRequestProtoMsg {
  typeUrl: "/cosmos.group.v1.MemberRequest";
  value: Uint8Array;
}
/**
 * MemberRequest represents a group member to be used in Msg server requests.
 * Contrary to `Member`, it doesn't have any `added_at` field
 * since this field cannot be set as part of requests.
 */
export interface MemberRequestAmino {
  /** address is the member's account address. */
  address?: string;
  /** weight is the member's voting weight that should be greater than 0. */
  weight?: string;
  /** metadata is any arbitrary metadata attached to the member. */
  metadata?: string;
}
export interface MemberRequestAminoMsg {
  type: "cosmos-sdk/MemberRequest";
  value: MemberRequestAmino;
}
/**
 * MemberRequest represents a group member to be used in Msg server requests.
 * Contrary to `Member`, it doesn't have any `added_at` field
 * since this field cannot be set as part of requests.
 */
export interface MemberRequestSDKType {
  address: string;
  weight: string;
  metadata: string;
}
/**
 * ThresholdDecisionPolicy is a decision policy where a proposal passes when it
 * satisfies the two following conditions:
 * 1. The sum of all `YES` voter's weights is greater or equal than the defined
 *    `threshold`.
 * 2. The voting and execution periods of the proposal respect the parameters
 *    given by `windows`.
 */
export interface ThresholdDecisionPolicy {
  /**
   * threshold is the minimum weighted sum of `YES` votes that must be met or
   * exceeded for a proposal to succeed.
   */
  threshold: string;
  /** windows defines the different windows for voting and execution. */
  windows?: DecisionPolicyWindows;
}
export interface ThresholdDecisionPolicyProtoMsg {
  typeUrl: "/cosmos.group.v1.ThresholdDecisionPolicy";
  value: Uint8Array;
}
/**
 * ThresholdDecisionPolicy is a decision policy where a proposal passes when it
 * satisfies the two following conditions:
 * 1. The sum of all `YES` voter's weights is greater or equal than the defined
 *    `threshold`.
 * 2. The voting and execution periods of the proposal respect the parameters
 *    given by `windows`.
 */
export interface ThresholdDecisionPolicyAmino {
  /**
   * threshold is the minimum weighted sum of `YES` votes that must be met or
   * exceeded for a proposal to succeed.
   */
  threshold?: string;
  /** windows defines the different windows for voting and execution. */
  windows?: DecisionPolicyWindowsAmino;
}
export interface ThresholdDecisionPolicyAminoMsg {
  type: "cosmos-sdk/ThresholdDecisionPolicy";
  value: ThresholdDecisionPolicyAmino;
}
/**
 * ThresholdDecisionPolicy is a decision policy where a proposal passes when it
 * satisfies the two following conditions:
 * 1. The sum of all `YES` voter's weights is greater or equal than the defined
 *    `threshold`.
 * 2. The voting and execution periods of the proposal respect the parameters
 *    given by `windows`.
 */
export interface ThresholdDecisionPolicySDKType {
  threshold: string;
  windows?: DecisionPolicyWindowsSDKType;
}
/**
 * PercentageDecisionPolicy is a decision policy where a proposal passes when
 * it satisfies the two following conditions:
 * 1. The percentage of all `YES` voters' weights out of the total group weight
 *    is greater or equal than the given `percentage`.
 * 2. The voting and execution periods of the proposal respect the parameters
 *    given by `windows`.
 */
export interface PercentageDecisionPolicy {
  /**
   * percentage is the minimum percentage of the weighted sum of `YES` votes must
   * meet for a proposal to succeed.
   */
  percentage: string;
  /** windows defines the different windows for voting and execution. */
  windows?: DecisionPolicyWindows;
}
export interface PercentageDecisionPolicyProtoMsg {
  typeUrl: "/cosmos.group.v1.PercentageDecisionPolicy";
  value: Uint8Array;
}
/**
 * PercentageDecisionPolicy is a decision policy where a proposal passes when
 * it satisfies the two following conditions:
 * 1. The percentage of all `YES` voters' weights out of the total group weight
 *    is greater or equal than the given `percentage`.
 * 2. The voting and execution periods of the proposal respect the parameters
 *    given by `windows`.
 */
export interface PercentageDecisionPolicyAmino {
  /**
   * percentage is the minimum percentage of the weighted sum of `YES` votes must
   * meet for a proposal to succeed.
   */
  percentage?: string;
  /** windows defines the different windows for voting and execution. */
  windows?: DecisionPolicyWindowsAmino;
}
export interface PercentageDecisionPolicyAminoMsg {
  type: "cosmos-sdk/PercentageDecisionPolicy";
  value: PercentageDecisionPolicyAmino;
}
/**
 * PercentageDecisionPolicy is a decision policy where a proposal passes when
 * it satisfies the two following conditions:
 * 1. The percentage of all `YES` voters' weights out of the total group weight
 *    is greater or equal than the given `percentage`.
 * 2. The voting and execution periods of the proposal respect the parameters
 *    given by `windows`.
 */
export interface PercentageDecisionPolicySDKType {
  percentage: string;
  windows?: DecisionPolicyWindowsSDKType;
}
/** DecisionPolicyWindows defines the different windows for voting and execution. */
export interface DecisionPolicyWindows {
  /**
   * voting_period is the duration from submission of a proposal to the end of voting period
   * Within this times votes can be submitted with MsgVote.
   */
  votingPeriod: Duration;
  /**
   * min_execution_period is the minimum duration after the proposal submission
   * where members can start sending MsgExec. This means that the window for
   * sending a MsgExec transaction is:
   * `[ submission + min_execution_period ; submission + voting_period + max_execution_period]`
   * where max_execution_period is a app-specific config, defined in the keeper.
   * If not set, min_execution_period will default to 0.
   * 
   * Please make sure to set a `min_execution_period` that is smaller than
   * `voting_period + max_execution_period`, or else the above execution window
   * is empty, meaning that all proposals created with this decision policy
   * won't be able to be executed.
   */
  minExecutionPeriod: Duration;
}
export interface DecisionPolicyWindowsProtoMsg {
  typeUrl: "/cosmos.group.v1.DecisionPolicyWindows";
  value: Uint8Array;
}
/** DecisionPolicyWindows defines the different windows for voting and execution. */
export interface DecisionPolicyWindowsAmino {
  /**
   * voting_period is the duration from submission of a proposal to the end of voting period
   * Within this times votes can be submitted with MsgVote.
   */
  voting_period: DurationAmino;
  /**
   * min_execution_period is the minimum duration after the proposal submission
   * where members can start sending MsgExec. This means that the window for
   * sending a MsgExec transaction is:
   * `[ submission + min_execution_period ; submission + voting_period + max_execution_period]`
   * where max_execution_period is a app-specific config, defined in the keeper.
   * If not set, min_execution_period will default to 0.
   * 
   * Please make sure to set a `min_execution_period` that is smaller than
   * `voting_period + max_execution_period`, or else the above execution window
   * is empty, meaning that all proposals created with this decision policy
   * won't be able to be executed.
   */
  min_execution_period: DurationAmino;
}
export interface DecisionPolicyWindowsAminoMsg {
  type: "cosmos-sdk/DecisionPolicyWindows";
  value: DecisionPolicyWindowsAmino;
}
/** DecisionPolicyWindows defines the different windows for voting and execution. */
export interface DecisionPolicyWindowsSDKType {
  voting_period: DurationSDKType;
  min_execution_period: DurationSDKType;
}
/** GroupInfo represents the high-level on-chain information for a group. */
export interface GroupInfo {
  /** id is the unique ID of the group. */
  id: Long;
  /** admin is the account address of the group's admin. */
  admin: string;
  /** metadata is any arbitrary metadata to attached to the group. */
  metadata: string;
  /**
   * version is used to track changes to a group's membership structure that
   * would break existing proposals. Whenever any members weight is changed,
   * or any member is added or removed this version is incremented and will
   * cause proposals based on older versions of this group to fail
   */
  version: Long;
  /** total_weight is the sum of the group members' weights. */
  totalWeight: string;
  /** created_at is a timestamp specifying when a group was created. */
  createdAt: Date;
}
export interface GroupInfoProtoMsg {
  typeUrl: "/cosmos.group.v1.GroupInfo";
  value: Uint8Array;
}
/** GroupInfo represents the high-level on-chain information for a group. */
export interface GroupInfoAmino {
  /** id is the unique ID of the group. */
  id?: string;
  /** admin is the account address of the group's admin. */
  admin?: string;
  /** metadata is any arbitrary metadata to attached to the group. */
  metadata?: string;
  /**
   * version is used to track changes to a group's membership structure that
   * would break existing proposals. Whenever any members weight is changed,
   * or any member is added or removed this version is incremented and will
   * cause proposals based on older versions of this group to fail
   */
  version?: string;
  /** total_weight is the sum of the group members' weights. */
  total_weight?: string;
  /** created_at is a timestamp specifying when a group was created. */
  created_at: string;
}
export interface GroupInfoAminoMsg {
  type: "cosmos-sdk/GroupInfo";
  value: GroupInfoAmino;
}
/** GroupInfo represents the high-level on-chain information for a group. */
export interface GroupInfoSDKType {
  id: Long;
  admin: string;
  metadata: string;
  version: Long;
  total_weight: string;
  created_at: Date;
}
/** GroupMember represents the relationship between a group and a member. */
export interface GroupMember {
  /** group_id is the unique ID of the group. */
  groupId: Long;
  /** member is the member data. */
  member?: Member;
}
export interface GroupMemberProtoMsg {
  typeUrl: "/cosmos.group.v1.GroupMember";
  value: Uint8Array;
}
/** GroupMember represents the relationship between a group and a member. */
export interface GroupMemberAmino {
  /** group_id is the unique ID of the group. */
  group_id?: string;
  /** member is the member data. */
  member?: MemberAmino;
}
export interface GroupMemberAminoMsg {
  type: "cosmos-sdk/GroupMember";
  value: GroupMemberAmino;
}
/** GroupMember represents the relationship between a group and a member. */
export interface GroupMemberSDKType {
  group_id: Long;
  member?: MemberSDKType;
}
/** GroupPolicyInfo represents the high-level on-chain information for a group policy. */
export interface GroupPolicyInfo {
  /** address is the account address of group policy. */
  address: string;
  /** group_id is the unique ID of the group. */
  groupId: Long;
  /** admin is the account address of the group admin. */
  admin: string;
  /**
   * metadata is any arbitrary metadata attached to the group policy.
   * the recommended format of the metadata is to be found here:
   * https://docs.cosmos.network/v0.47/modules/group#decision-policy-1
   */
  metadata: string;
  /**
   * version is used to track changes to a group's GroupPolicyInfo structure that
   * would create a different result on a running proposal.
   */
  version: Long;
  /** decision_policy specifies the group policy's decision policy. */
  decisionPolicy?: Any;
  /** created_at is a timestamp specifying when a group policy was created. */
  createdAt: Date;
}
export interface GroupPolicyInfoProtoMsg {
  typeUrl: "/cosmos.group.v1.GroupPolicyInfo";
  value: Uint8Array;
}
/** GroupPolicyInfo represents the high-level on-chain information for a group policy. */
export interface GroupPolicyInfoAmino {
  /** address is the account address of group policy. */
  address?: string;
  /** group_id is the unique ID of the group. */
  group_id?: string;
  /** admin is the account address of the group admin. */
  admin?: string;
  /**
   * metadata is any arbitrary metadata attached to the group policy.
   * the recommended format of the metadata is to be found here:
   * https://docs.cosmos.network/v0.47/modules/group#decision-policy-1
   */
  metadata?: string;
  /**
   * version is used to track changes to a group's GroupPolicyInfo structure that
   * would create a different result on a running proposal.
   */
  version?: string;
  /** decision_policy specifies the group policy's decision policy. */
  decision_policy?: AnyAmino;
  /** created_at is a timestamp specifying when a group policy was created. */
  created_at: string;
}
export interface GroupPolicyInfoAminoMsg {
  type: "cosmos-sdk/GroupPolicyInfo";
  value: GroupPolicyInfoAmino;
}
/** GroupPolicyInfo represents the high-level on-chain information for a group policy. */
export interface GroupPolicyInfoSDKType {
  address: string;
  group_id: Long;
  admin: string;
  metadata: string;
  version: Long;
  decision_policy?: AnySDKType;
  created_at: Date;
}
/**
 * Proposal defines a group proposal. Any member of a group can submit a proposal
 * for a group policy to decide upon.
 * A proposal consists of a set of `sdk.Msg`s that will be executed if the proposal
 * passes as well as some optional metadata associated with the proposal.
 */
export interface Proposal {
  /** id is the unique id of the proposal. */
  id: Long;
  /** group_policy_address is the account address of group policy. */
  groupPolicyAddress: string;
  /**
   * metadata is any arbitrary metadata attached to the proposal.
   * the recommended format of the metadata is to be found here:
   * https://docs.cosmos.network/v0.47/modules/group#proposal-4
   */
  metadata: string;
  /** proposers are the account addresses of the proposers. */
  proposers: string[];
  /** submit_time is a timestamp specifying when a proposal was submitted. */
  submitTime: Date;
  /**
   * group_version tracks the version of the group at proposal submission.
   * This field is here for informational purposes only.
   */
  groupVersion: Long;
  /**
   * group_policy_version tracks the version of the group policy at proposal submission.
   * When a decision policy is changed, existing proposals from previous policy
   * versions will become invalid with the `ABORTED` status.
   * This field is here for informational purposes only.
   */
  groupPolicyVersion: Long;
  /** status represents the high level position in the life cycle of the proposal. Initial value is Submitted. */
  status: ProposalStatus;
  /**
   * final_tally_result contains the sums of all weighted votes for this
   * proposal for each vote option. It is empty at submission, and only
   * populated after tallying, at voting period end or at proposal execution,
   * whichever happens first.
   */
  finalTallyResult: TallyResult;
  /**
   * voting_period_end is the timestamp before which voting must be done.
   * Unless a successful MsgExec is called before (to execute a proposal whose
   * tally is successful before the voting period ends), tallying will be done
   * at this point, and the `final_tally_result`and `status` fields will be
   * accordingly updated.
   */
  votingPeriodEnd: Date;
  /** executor_result is the final result of the proposal execution. Initial value is NotRun. */
  executorResult: ProposalExecutorResult;
  /** messages is a list of `sdk.Msg`s that will be executed if the proposal passes. */
  messages: Any[];
  /**
   * title is the title of the proposal
   * 
   * Since: cosmos-sdk 0.47
   */
  title: string;
  /**
   * summary is a short summary of the proposal
   * 
   * Since: cosmos-sdk 0.47
   */
  summary: string;
}
export interface ProposalProtoMsg {
  typeUrl: "/cosmos.group.v1.Proposal";
  value: Uint8Array;
}
/**
 * Proposal defines a group proposal. Any member of a group can submit a proposal
 * for a group policy to decide upon.
 * A proposal consists of a set of `sdk.Msg`s that will be executed if the proposal
 * passes as well as some optional metadata associated with the proposal.
 */
export interface ProposalAmino {
  /** id is the unique id of the proposal. */
  id?: string;
  /** group_policy_address is the account address of group policy. */
  group_policy_address?: string;
  /**
   * metadata is any arbitrary metadata attached to the proposal.
   * the recommended format of the metadata is to be found here:
   * https://docs.cosmos.network/v0.47/modules/group#proposal-4
   */
  metadata?: string;
  /** proposers are the account addresses of the proposers. */
  proposers?: string[];
  /** submit_time is a timestamp specifying when a proposal was submitted. */
  submit_time: string;
  /**
   * group_version tracks the version of the group at proposal submission.
   * This field is here for informational purposes only.
   */
  group_version?: string;
  /**
   * group_policy_version tracks the version of the group policy at proposal submission.
   * When a decision policy is changed, existing proposals from previous policy
   * versions will become invalid with the `ABORTED` status.
   * This field is here for informational purposes only.
   */
  group_policy_version?: string;
  /** status represents the high level position in the life cycle of the proposal. Initial value is Submitted. */
  status?: ProposalStatus;
  /**
   * final_tally_result contains the sums of all weighted votes for this
   * proposal for each vote option. It is empty at submission, and only
   * populated after tallying, at voting period end or at proposal execution,
   * whichever happens first.
   */
  final_tally_result: TallyResultAmino;
  /**
   * voting_period_end is the timestamp before which voting must be done.
   * Unless a successful MsgExec is called before (to execute a proposal whose
   * tally is successful before the voting period ends), tallying will be done
   * at this point, and the `final_tally_result`and `status` fields will be
   * accordingly updated.
   */
  voting_period_end: string;
  /** executor_result is the final result of the proposal execution. Initial value is NotRun. */
  executor_result?: ProposalExecutorResult;
  /** messages is a list of `sdk.Msg`s that will be executed if the proposal passes. */
  messages?: AnyAmino[];
  /**
   * title is the title of the proposal
   * 
   * Since: cosmos-sdk 0.47
   */
  title?: string;
  /**
   * summary is a short summary of the proposal
   * 
   * Since: cosmos-sdk 0.47
   */
  summary?: string;
}
export interface ProposalAminoMsg {
  type: "cosmos-sdk/Proposal";
  value: ProposalAmino;
}
/**
 * Proposal defines a group proposal. Any member of a group can submit a proposal
 * for a group policy to decide upon.
 * A proposal consists of a set of `sdk.Msg`s that will be executed if the proposal
 * passes as well as some optional metadata associated with the proposal.
 */
export interface ProposalSDKType {
  id: Long;
  group_policy_address: string;
  metadata: string;
  proposers: string[];
  submit_time: Date;
  group_version: Long;
  group_policy_version: Long;
  status: ProposalStatus;
  final_tally_result: TallyResultSDKType;
  voting_period_end: Date;
  executor_result: ProposalExecutorResult;
  messages: AnySDKType[];
  title: string;
  summary: string;
}
/** TallyResult represents the sum of weighted votes for each vote option. */
export interface TallyResult {
  /** yes_count is the weighted sum of yes votes. */
  yesCount: string;
  /** abstain_count is the weighted sum of abstainers. */
  abstainCount: string;
  /** no_count is the weighted sum of no votes. */
  noCount: string;
  /** no_with_veto_count is the weighted sum of veto. */
  noWithVetoCount: string;
}
export interface TallyResultProtoMsg {
  typeUrl: "/cosmos.group.v1.TallyResult";
  value: Uint8Array;
}
/** TallyResult represents the sum of weighted votes for each vote option. */
export interface TallyResultAmino {
  /** yes_count is the weighted sum of yes votes. */
  yes_count?: string;
  /** abstain_count is the weighted sum of abstainers. */
  abstain_count?: string;
  /** no_count is the weighted sum of no votes. */
  no_count?: string;
  /** no_with_veto_count is the weighted sum of veto. */
  no_with_veto_count?: string;
}
export interface TallyResultAminoMsg {
  type: "cosmos-sdk/TallyResult";
  value: TallyResultAmino;
}
/** TallyResult represents the sum of weighted votes for each vote option. */
export interface TallyResultSDKType {
  yes_count: string;
  abstain_count: string;
  no_count: string;
  no_with_veto_count: string;
}
/** Vote represents a vote for a proposal. */
export interface Vote {
  /** proposal is the unique ID of the proposal. */
  proposalId: Long;
  /** voter is the account address of the voter. */
  voter: string;
  /** option is the voter's choice on the proposal. */
  option: VoteOption;
  /** metadata is any arbitrary metadata attached to the vote. */
  metadata: string;
  /** submit_time is the timestamp when the vote was submitted. */
  submitTime: Date;
}
export interface VoteProtoMsg {
  typeUrl: "/cosmos.group.v1.Vote";
  value: Uint8Array;
}
/** Vote represents a vote for a proposal. */
export interface VoteAmino {
  /** proposal is the unique ID of the proposal. */
  proposal_id?: string;
  /** voter is the account address of the voter. */
  voter?: string;
  /** option is the voter's choice on the proposal. */
  option?: VoteOption;
  /** metadata is any arbitrary metadata attached to the vote. */
  metadata?: string;
  /** submit_time is the timestamp when the vote was submitted. */
  submit_time: string;
}
export interface VoteAminoMsg {
  type: "cosmos-sdk/Vote";
  value: VoteAmino;
}
/** Vote represents a vote for a proposal. */
export interface VoteSDKType {
  proposal_id: Long;
  voter: string;
  option: VoteOption;
  metadata: string;
  submit_time: Date;
}
function createBaseMember(): Member {
  return {
    address: "",
    weight: "",
    metadata: "",
    addedAt: new Date()
  };
}
export const Member = {
  typeUrl: "/cosmos.group.v1.Member",
  encode(message: Member, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.weight !== "") {
      writer.uint32(18).string(message.weight);
    }
    if (message.metadata !== "") {
      writer.uint32(26).string(message.metadata);
    }
    if (message.addedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.addedAt), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Member {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMember();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.weight = reader.string();
          break;
        case 3:
          message.metadata = reader.string();
          break;
        case 4:
          message.addedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Member {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      weight: isSet(object.weight) ? String(object.weight) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      addedAt: isSet(object.addedAt) ? fromJsonTimestamp(object.addedAt) : undefined
    };
  },
  toJSON(message: Member): JsonSafe<Member> {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.weight !== undefined && (obj.weight = message.weight);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.addedAt !== undefined && (obj.addedAt = message.addedAt.toISOString());
    return obj;
  },
  fromPartial(object: Partial<Member>): Member {
    const message = createBaseMember();
    message.address = object.address ?? "";
    message.weight = object.weight ?? "";
    message.metadata = object.metadata ?? "";
    message.addedAt = object.addedAt ?? undefined;
    return message;
  },
  fromAmino(object: MemberAmino): Member {
    const message = createBaseMember();
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    if (object.weight !== undefined && object.weight !== null) {
      message.weight = object.weight;
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = object.metadata;
    }
    if (object.added_at !== undefined && object.added_at !== null) {
      message.addedAt = fromTimestamp(Timestamp.fromAmino(object.added_at));
    }
    return message;
  },
  toAmino(message: Member): MemberAmino {
    const obj: any = {};
    obj.address = message.address === "" ? undefined : message.address;
    obj.weight = message.weight === "" ? undefined : message.weight;
    obj.metadata = message.metadata === "" ? undefined : message.metadata;
    obj.added_at = message.addedAt ? Timestamp.toAmino(toTimestamp(message.addedAt)) : new Date();
    return obj;
  },
  fromAminoMsg(object: MemberAminoMsg): Member {
    return Member.fromAmino(object.value);
  },
  toAminoMsg(message: Member): MemberAminoMsg {
    return {
      type: "cosmos-sdk/Member",
      value: Member.toAmino(message)
    };
  },
  fromProtoMsg(message: MemberProtoMsg): Member {
    return Member.decode(message.value);
  },
  toProto(message: Member): Uint8Array {
    return Member.encode(message).finish();
  },
  toProtoMsg(message: Member): MemberProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.Member",
      value: Member.encode(message).finish()
    };
  }
};
function createBaseMemberRequest(): MemberRequest {
  return {
    address: "",
    weight: "",
    metadata: ""
  };
}
export const MemberRequest = {
  typeUrl: "/cosmos.group.v1.MemberRequest",
  encode(message: MemberRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.weight !== "") {
      writer.uint32(18).string(message.weight);
    }
    if (message.metadata !== "") {
      writer.uint32(26).string(message.metadata);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MemberRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMemberRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.weight = reader.string();
          break;
        case 3:
          message.metadata = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MemberRequest {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      weight: isSet(object.weight) ? String(object.weight) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : ""
    };
  },
  toJSON(message: MemberRequest): JsonSafe<MemberRequest> {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.weight !== undefined && (obj.weight = message.weight);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    return obj;
  },
  fromPartial(object: Partial<MemberRequest>): MemberRequest {
    const message = createBaseMemberRequest();
    message.address = object.address ?? "";
    message.weight = object.weight ?? "";
    message.metadata = object.metadata ?? "";
    return message;
  },
  fromAmino(object: MemberRequestAmino): MemberRequest {
    const message = createBaseMemberRequest();
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    if (object.weight !== undefined && object.weight !== null) {
      message.weight = object.weight;
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = object.metadata;
    }
    return message;
  },
  toAmino(message: MemberRequest): MemberRequestAmino {
    const obj: any = {};
    obj.address = message.address === "" ? undefined : message.address;
    obj.weight = message.weight === "" ? undefined : message.weight;
    obj.metadata = message.metadata === "" ? undefined : message.metadata;
    return obj;
  },
  fromAminoMsg(object: MemberRequestAminoMsg): MemberRequest {
    return MemberRequest.fromAmino(object.value);
  },
  toAminoMsg(message: MemberRequest): MemberRequestAminoMsg {
    return {
      type: "cosmos-sdk/MemberRequest",
      value: MemberRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: MemberRequestProtoMsg): MemberRequest {
    return MemberRequest.decode(message.value);
  },
  toProto(message: MemberRequest): Uint8Array {
    return MemberRequest.encode(message).finish();
  },
  toProtoMsg(message: MemberRequest): MemberRequestProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.MemberRequest",
      value: MemberRequest.encode(message).finish()
    };
  }
};
function createBaseThresholdDecisionPolicy(): ThresholdDecisionPolicy {
  return {
    threshold: "",
    windows: undefined
  };
}
export const ThresholdDecisionPolicy = {
  typeUrl: "/cosmos.group.v1.ThresholdDecisionPolicy",
  encode(message: ThresholdDecisionPolicy, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.threshold !== "") {
      writer.uint32(10).string(message.threshold);
    }
    if (message.windows !== undefined) {
      DecisionPolicyWindows.encode(message.windows, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): ThresholdDecisionPolicy {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThresholdDecisionPolicy();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.threshold = reader.string();
          break;
        case 2:
          message.windows = DecisionPolicyWindows.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ThresholdDecisionPolicy {
    return {
      threshold: isSet(object.threshold) ? String(object.threshold) : "",
      windows: isSet(object.windows) ? DecisionPolicyWindows.fromJSON(object.windows) : undefined
    };
  },
  toJSON(message: ThresholdDecisionPolicy): JsonSafe<ThresholdDecisionPolicy> {
    const obj: any = {};
    message.threshold !== undefined && (obj.threshold = message.threshold);
    message.windows !== undefined && (obj.windows = message.windows ? DecisionPolicyWindows.toJSON(message.windows) : undefined);
    return obj;
  },
  fromPartial(object: Partial<ThresholdDecisionPolicy>): ThresholdDecisionPolicy {
    const message = createBaseThresholdDecisionPolicy();
    message.threshold = object.threshold ?? "";
    message.windows = object.windows !== undefined && object.windows !== null ? DecisionPolicyWindows.fromPartial(object.windows) : undefined;
    return message;
  },
  fromAmino(object: ThresholdDecisionPolicyAmino): ThresholdDecisionPolicy {
    const message = createBaseThresholdDecisionPolicy();
    if (object.threshold !== undefined && object.threshold !== null) {
      message.threshold = object.threshold;
    }
    if (object.windows !== undefined && object.windows !== null) {
      message.windows = DecisionPolicyWindows.fromAmino(object.windows);
    }
    return message;
  },
  toAmino(message: ThresholdDecisionPolicy): ThresholdDecisionPolicyAmino {
    const obj: any = {};
    obj.threshold = message.threshold === "" ? undefined : message.threshold;
    obj.windows = message.windows ? DecisionPolicyWindows.toAmino(message.windows) : undefined;
    return obj;
  },
  fromAminoMsg(object: ThresholdDecisionPolicyAminoMsg): ThresholdDecisionPolicy {
    return ThresholdDecisionPolicy.fromAmino(object.value);
  },
  toAminoMsg(message: ThresholdDecisionPolicy): ThresholdDecisionPolicyAminoMsg {
    return {
      type: "cosmos-sdk/ThresholdDecisionPolicy",
      value: ThresholdDecisionPolicy.toAmino(message)
    };
  },
  fromProtoMsg(message: ThresholdDecisionPolicyProtoMsg): ThresholdDecisionPolicy {
    return ThresholdDecisionPolicy.decode(message.value);
  },
  toProto(message: ThresholdDecisionPolicy): Uint8Array {
    return ThresholdDecisionPolicy.encode(message).finish();
  },
  toProtoMsg(message: ThresholdDecisionPolicy): ThresholdDecisionPolicyProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.ThresholdDecisionPolicy",
      value: ThresholdDecisionPolicy.encode(message).finish()
    };
  }
};
function createBasePercentageDecisionPolicy(): PercentageDecisionPolicy {
  return {
    percentage: "",
    windows: undefined
  };
}
export const PercentageDecisionPolicy = {
  typeUrl: "/cosmos.group.v1.PercentageDecisionPolicy",
  encode(message: PercentageDecisionPolicy, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.percentage !== "") {
      writer.uint32(10).string(message.percentage);
    }
    if (message.windows !== undefined) {
      DecisionPolicyWindows.encode(message.windows, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): PercentageDecisionPolicy {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePercentageDecisionPolicy();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.percentage = reader.string();
          break;
        case 2:
          message.windows = DecisionPolicyWindows.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PercentageDecisionPolicy {
    return {
      percentage: isSet(object.percentage) ? String(object.percentage) : "",
      windows: isSet(object.windows) ? DecisionPolicyWindows.fromJSON(object.windows) : undefined
    };
  },
  toJSON(message: PercentageDecisionPolicy): JsonSafe<PercentageDecisionPolicy> {
    const obj: any = {};
    message.percentage !== undefined && (obj.percentage = message.percentage);
    message.windows !== undefined && (obj.windows = message.windows ? DecisionPolicyWindows.toJSON(message.windows) : undefined);
    return obj;
  },
  fromPartial(object: Partial<PercentageDecisionPolicy>): PercentageDecisionPolicy {
    const message = createBasePercentageDecisionPolicy();
    message.percentage = object.percentage ?? "";
    message.windows = object.windows !== undefined && object.windows !== null ? DecisionPolicyWindows.fromPartial(object.windows) : undefined;
    return message;
  },
  fromAmino(object: PercentageDecisionPolicyAmino): PercentageDecisionPolicy {
    const message = createBasePercentageDecisionPolicy();
    if (object.percentage !== undefined && object.percentage !== null) {
      message.percentage = object.percentage;
    }
    if (object.windows !== undefined && object.windows !== null) {
      message.windows = DecisionPolicyWindows.fromAmino(object.windows);
    }
    return message;
  },
  toAmino(message: PercentageDecisionPolicy): PercentageDecisionPolicyAmino {
    const obj: any = {};
    obj.percentage = message.percentage === "" ? undefined : message.percentage;
    obj.windows = message.windows ? DecisionPolicyWindows.toAmino(message.windows) : undefined;
    return obj;
  },
  fromAminoMsg(object: PercentageDecisionPolicyAminoMsg): PercentageDecisionPolicy {
    return PercentageDecisionPolicy.fromAmino(object.value);
  },
  toAminoMsg(message: PercentageDecisionPolicy): PercentageDecisionPolicyAminoMsg {
    return {
      type: "cosmos-sdk/PercentageDecisionPolicy",
      value: PercentageDecisionPolicy.toAmino(message)
    };
  },
  fromProtoMsg(message: PercentageDecisionPolicyProtoMsg): PercentageDecisionPolicy {
    return PercentageDecisionPolicy.decode(message.value);
  },
  toProto(message: PercentageDecisionPolicy): Uint8Array {
    return PercentageDecisionPolicy.encode(message).finish();
  },
  toProtoMsg(message: PercentageDecisionPolicy): PercentageDecisionPolicyProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.PercentageDecisionPolicy",
      value: PercentageDecisionPolicy.encode(message).finish()
    };
  }
};
function createBaseDecisionPolicyWindows(): DecisionPolicyWindows {
  return {
    votingPeriod: Duration.fromPartial({}),
    minExecutionPeriod: Duration.fromPartial({})
  };
}
export const DecisionPolicyWindows = {
  typeUrl: "/cosmos.group.v1.DecisionPolicyWindows",
  encode(message: DecisionPolicyWindows, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.votingPeriod !== undefined) {
      Duration.encode(message.votingPeriod, writer.uint32(10).fork()).ldelim();
    }
    if (message.minExecutionPeriod !== undefined) {
      Duration.encode(message.minExecutionPeriod, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): DecisionPolicyWindows {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecisionPolicyWindows();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.votingPeriod = Duration.decode(reader, reader.uint32());
          break;
        case 2:
          message.minExecutionPeriod = Duration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DecisionPolicyWindows {
    return {
      votingPeriod: isSet(object.votingPeriod) ? Duration.fromJSON(object.votingPeriod) : undefined,
      minExecutionPeriod: isSet(object.minExecutionPeriod) ? Duration.fromJSON(object.minExecutionPeriod) : undefined
    };
  },
  toJSON(message: DecisionPolicyWindows): JsonSafe<DecisionPolicyWindows> {
    const obj: any = {};
    message.votingPeriod !== undefined && (obj.votingPeriod = message.votingPeriod ? Duration.toJSON(message.votingPeriod) : undefined);
    message.minExecutionPeriod !== undefined && (obj.minExecutionPeriod = message.minExecutionPeriod ? Duration.toJSON(message.minExecutionPeriod) : undefined);
    return obj;
  },
  fromPartial(object: Partial<DecisionPolicyWindows>): DecisionPolicyWindows {
    const message = createBaseDecisionPolicyWindows();
    message.votingPeriod = object.votingPeriod !== undefined && object.votingPeriod !== null ? Duration.fromPartial(object.votingPeriod) : undefined;
    message.minExecutionPeriod = object.minExecutionPeriod !== undefined && object.minExecutionPeriod !== null ? Duration.fromPartial(object.minExecutionPeriod) : undefined;
    return message;
  },
  fromAmino(object: DecisionPolicyWindowsAmino): DecisionPolicyWindows {
    const message = createBaseDecisionPolicyWindows();
    if (object.voting_period !== undefined && object.voting_period !== null) {
      message.votingPeriod = Duration.fromAmino(object.voting_period);
    }
    if (object.min_execution_period !== undefined && object.min_execution_period !== null) {
      message.minExecutionPeriod = Duration.fromAmino(object.min_execution_period);
    }
    return message;
  },
  toAmino(message: DecisionPolicyWindows): DecisionPolicyWindowsAmino {
    const obj: any = {};
    obj.voting_period = message.votingPeriod ? Duration.toAmino(message.votingPeriod) : Duration.toAmino(Duration.fromPartial({}));
    obj.min_execution_period = message.minExecutionPeriod ? Duration.toAmino(message.minExecutionPeriod) : Duration.toAmino(Duration.fromPartial({}));
    return obj;
  },
  fromAminoMsg(object: DecisionPolicyWindowsAminoMsg): DecisionPolicyWindows {
    return DecisionPolicyWindows.fromAmino(object.value);
  },
  toAminoMsg(message: DecisionPolicyWindows): DecisionPolicyWindowsAminoMsg {
    return {
      type: "cosmos-sdk/DecisionPolicyWindows",
      value: DecisionPolicyWindows.toAmino(message)
    };
  },
  fromProtoMsg(message: DecisionPolicyWindowsProtoMsg): DecisionPolicyWindows {
    return DecisionPolicyWindows.decode(message.value);
  },
  toProto(message: DecisionPolicyWindows): Uint8Array {
    return DecisionPolicyWindows.encode(message).finish();
  },
  toProtoMsg(message: DecisionPolicyWindows): DecisionPolicyWindowsProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.DecisionPolicyWindows",
      value: DecisionPolicyWindows.encode(message).finish()
    };
  }
};
function createBaseGroupInfo(): GroupInfo {
  return {
    id: Long.UZERO,
    admin: "",
    metadata: "",
    version: Long.UZERO,
    totalWeight: "",
    createdAt: new Date()
  };
}
export const GroupInfo = {
  typeUrl: "/cosmos.group.v1.GroupInfo",
  encode(message: GroupInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.id.isZero()) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.admin !== "") {
      writer.uint32(18).string(message.admin);
    }
    if (message.metadata !== "") {
      writer.uint32(26).string(message.metadata);
    }
    if (!message.version.isZero()) {
      writer.uint32(32).uint64(message.version);
    }
    if (message.totalWeight !== "") {
      writer.uint32(42).string(message.totalWeight);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GroupInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = (reader.uint64() as Long);
          break;
        case 2:
          message.admin = reader.string();
          break;
        case 3:
          message.metadata = reader.string();
          break;
        case 4:
          message.version = (reader.uint64() as Long);
          break;
        case 5:
          message.totalWeight = reader.string();
          break;
        case 6:
          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GroupInfo {
    return {
      id: isSet(object.id) ? Long.fromValue(object.id) : Long.UZERO,
      admin: isSet(object.admin) ? String(object.admin) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      version: isSet(object.version) ? Long.fromValue(object.version) : Long.UZERO,
      totalWeight: isSet(object.totalWeight) ? String(object.totalWeight) : "",
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined
    };
  },
  toJSON(message: GroupInfo): JsonSafe<GroupInfo> {
    const obj: any = {};
    message.id !== undefined && (obj.id = (message.id || Long.UZERO).toString());
    message.admin !== undefined && (obj.admin = message.admin);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.version !== undefined && (obj.version = (message.version || Long.UZERO).toString());
    message.totalWeight !== undefined && (obj.totalWeight = message.totalWeight);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt.toISOString());
    return obj;
  },
  fromPartial(object: Partial<GroupInfo>): GroupInfo {
    const message = createBaseGroupInfo();
    message.id = object.id !== undefined && object.id !== null ? Long.fromValue(object.id) : Long.UZERO;
    message.admin = object.admin ?? "";
    message.metadata = object.metadata ?? "";
    message.version = object.version !== undefined && object.version !== null ? Long.fromValue(object.version) : Long.UZERO;
    message.totalWeight = object.totalWeight ?? "";
    message.createdAt = object.createdAt ?? undefined;
    return message;
  },
  fromAmino(object: GroupInfoAmino): GroupInfo {
    const message = createBaseGroupInfo();
    if (object.id !== undefined && object.id !== null) {
      message.id = Long.fromString(object.id);
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = object.admin;
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = object.metadata;
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = Long.fromString(object.version);
    }
    if (object.total_weight !== undefined && object.total_weight !== null) {
      message.totalWeight = object.total_weight;
    }
    if (object.created_at !== undefined && object.created_at !== null) {
      message.createdAt = fromTimestamp(Timestamp.fromAmino(object.created_at));
    }
    return message;
  },
  toAmino(message: GroupInfo): GroupInfoAmino {
    const obj: any = {};
    obj.id = !message.id.isZero() ? message.id.toString() : undefined;
    obj.admin = message.admin === "" ? undefined : message.admin;
    obj.metadata = message.metadata === "" ? undefined : message.metadata;
    obj.version = !message.version.isZero() ? message.version.toString() : undefined;
    obj.total_weight = message.totalWeight === "" ? undefined : message.totalWeight;
    obj.created_at = message.createdAt ? Timestamp.toAmino(toTimestamp(message.createdAt)) : new Date();
    return obj;
  },
  fromAminoMsg(object: GroupInfoAminoMsg): GroupInfo {
    return GroupInfo.fromAmino(object.value);
  },
  toAminoMsg(message: GroupInfo): GroupInfoAminoMsg {
    return {
      type: "cosmos-sdk/GroupInfo",
      value: GroupInfo.toAmino(message)
    };
  },
  fromProtoMsg(message: GroupInfoProtoMsg): GroupInfo {
    return GroupInfo.decode(message.value);
  },
  toProto(message: GroupInfo): Uint8Array {
    return GroupInfo.encode(message).finish();
  },
  toProtoMsg(message: GroupInfo): GroupInfoProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.GroupInfo",
      value: GroupInfo.encode(message).finish()
    };
  }
};
function createBaseGroupMember(): GroupMember {
  return {
    groupId: Long.UZERO,
    member: undefined
  };
}
export const GroupMember = {
  typeUrl: "/cosmos.group.v1.GroupMember",
  encode(message: GroupMember, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.groupId.isZero()) {
      writer.uint32(8).uint64(message.groupId);
    }
    if (message.member !== undefined) {
      Member.encode(message.member, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GroupMember {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupMember();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.groupId = (reader.uint64() as Long);
          break;
        case 2:
          message.member = Member.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GroupMember {
    return {
      groupId: isSet(object.groupId) ? Long.fromValue(object.groupId) : Long.UZERO,
      member: isSet(object.member) ? Member.fromJSON(object.member) : undefined
    };
  },
  toJSON(message: GroupMember): JsonSafe<GroupMember> {
    const obj: any = {};
    message.groupId !== undefined && (obj.groupId = (message.groupId || Long.UZERO).toString());
    message.member !== undefined && (obj.member = message.member ? Member.toJSON(message.member) : undefined);
    return obj;
  },
  fromPartial(object: Partial<GroupMember>): GroupMember {
    const message = createBaseGroupMember();
    message.groupId = object.groupId !== undefined && object.groupId !== null ? Long.fromValue(object.groupId) : Long.UZERO;
    message.member = object.member !== undefined && object.member !== null ? Member.fromPartial(object.member) : undefined;
    return message;
  },
  fromAmino(object: GroupMemberAmino): GroupMember {
    const message = createBaseGroupMember();
    if (object.group_id !== undefined && object.group_id !== null) {
      message.groupId = Long.fromString(object.group_id);
    }
    if (object.member !== undefined && object.member !== null) {
      message.member = Member.fromAmino(object.member);
    }
    return message;
  },
  toAmino(message: GroupMember): GroupMemberAmino {
    const obj: any = {};
    obj.group_id = !message.groupId.isZero() ? message.groupId.toString() : undefined;
    obj.member = message.member ? Member.toAmino(message.member) : undefined;
    return obj;
  },
  fromAminoMsg(object: GroupMemberAminoMsg): GroupMember {
    return GroupMember.fromAmino(object.value);
  },
  toAminoMsg(message: GroupMember): GroupMemberAminoMsg {
    return {
      type: "cosmos-sdk/GroupMember",
      value: GroupMember.toAmino(message)
    };
  },
  fromProtoMsg(message: GroupMemberProtoMsg): GroupMember {
    return GroupMember.decode(message.value);
  },
  toProto(message: GroupMember): Uint8Array {
    return GroupMember.encode(message).finish();
  },
  toProtoMsg(message: GroupMember): GroupMemberProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.GroupMember",
      value: GroupMember.encode(message).finish()
    };
  }
};
function createBaseGroupPolicyInfo(): GroupPolicyInfo {
  return {
    address: "",
    groupId: Long.UZERO,
    admin: "",
    metadata: "",
    version: Long.UZERO,
    decisionPolicy: undefined,
    createdAt: new Date()
  };
}
export const GroupPolicyInfo = {
  typeUrl: "/cosmos.group.v1.GroupPolicyInfo",
  encode(message: GroupPolicyInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (!message.groupId.isZero()) {
      writer.uint32(16).uint64(message.groupId);
    }
    if (message.admin !== "") {
      writer.uint32(26).string(message.admin);
    }
    if (message.metadata !== "") {
      writer.uint32(34).string(message.metadata);
    }
    if (!message.version.isZero()) {
      writer.uint32(40).uint64(message.version);
    }
    if (message.decisionPolicy !== undefined) {
      Any.encode(message.decisionPolicy, writer.uint32(50).fork()).ldelim();
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GroupPolicyInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupPolicyInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.groupId = (reader.uint64() as Long);
          break;
        case 3:
          message.admin = reader.string();
          break;
        case 4:
          message.metadata = reader.string();
          break;
        case 5:
          message.version = (reader.uint64() as Long);
          break;
        case 6:
          message.decisionPolicy = Any.decode(reader, reader.uint32());
          break;
        case 7:
          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GroupPolicyInfo {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      groupId: isSet(object.groupId) ? Long.fromValue(object.groupId) : Long.UZERO,
      admin: isSet(object.admin) ? String(object.admin) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      version: isSet(object.version) ? Long.fromValue(object.version) : Long.UZERO,
      decisionPolicy: isSet(object.decisionPolicy) ? Any.fromJSON(object.decisionPolicy) : undefined,
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined
    };
  },
  toJSON(message: GroupPolicyInfo): JsonSafe<GroupPolicyInfo> {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.groupId !== undefined && (obj.groupId = (message.groupId || Long.UZERO).toString());
    message.admin !== undefined && (obj.admin = message.admin);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.version !== undefined && (obj.version = (message.version || Long.UZERO).toString());
    message.decisionPolicy !== undefined && (obj.decisionPolicy = message.decisionPolicy ? Any.toJSON(message.decisionPolicy) : undefined);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt.toISOString());
    return obj;
  },
  fromPartial(object: Partial<GroupPolicyInfo>): GroupPolicyInfo {
    const message = createBaseGroupPolicyInfo();
    message.address = object.address ?? "";
    message.groupId = object.groupId !== undefined && object.groupId !== null ? Long.fromValue(object.groupId) : Long.UZERO;
    message.admin = object.admin ?? "";
    message.metadata = object.metadata ?? "";
    message.version = object.version !== undefined && object.version !== null ? Long.fromValue(object.version) : Long.UZERO;
    message.decisionPolicy = object.decisionPolicy !== undefined && object.decisionPolicy !== null ? Any.fromPartial(object.decisionPolicy) : undefined;
    message.createdAt = object.createdAt ?? undefined;
    return message;
  },
  fromAmino(object: GroupPolicyInfoAmino): GroupPolicyInfo {
    const message = createBaseGroupPolicyInfo();
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    if (object.group_id !== undefined && object.group_id !== null) {
      message.groupId = Long.fromString(object.group_id);
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = object.admin;
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = object.metadata;
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = Long.fromString(object.version);
    }
    if (object.decision_policy !== undefined && object.decision_policy !== null) {
      message.decisionPolicy = Any.fromAmino(object.decision_policy);
    }
    if (object.created_at !== undefined && object.created_at !== null) {
      message.createdAt = fromTimestamp(Timestamp.fromAmino(object.created_at));
    }
    return message;
  },
  toAmino(message: GroupPolicyInfo): GroupPolicyInfoAmino {
    const obj: any = {};
    obj.address = message.address === "" ? undefined : message.address;
    obj.group_id = !message.groupId.isZero() ? message.groupId.toString() : undefined;
    obj.admin = message.admin === "" ? undefined : message.admin;
    obj.metadata = message.metadata === "" ? undefined : message.metadata;
    obj.version = !message.version.isZero() ? message.version.toString() : undefined;
    obj.decision_policy = message.decisionPolicy ? Any.toAmino(message.decisionPolicy) : undefined;
    obj.created_at = message.createdAt ? Timestamp.toAmino(toTimestamp(message.createdAt)) : new Date();
    return obj;
  },
  fromAminoMsg(object: GroupPolicyInfoAminoMsg): GroupPolicyInfo {
    return GroupPolicyInfo.fromAmino(object.value);
  },
  toAminoMsg(message: GroupPolicyInfo): GroupPolicyInfoAminoMsg {
    return {
      type: "cosmos-sdk/GroupPolicyInfo",
      value: GroupPolicyInfo.toAmino(message)
    };
  },
  fromProtoMsg(message: GroupPolicyInfoProtoMsg): GroupPolicyInfo {
    return GroupPolicyInfo.decode(message.value);
  },
  toProto(message: GroupPolicyInfo): Uint8Array {
    return GroupPolicyInfo.encode(message).finish();
  },
  toProtoMsg(message: GroupPolicyInfo): GroupPolicyInfoProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.GroupPolicyInfo",
      value: GroupPolicyInfo.encode(message).finish()
    };
  }
};
function createBaseProposal(): Proposal {
  return {
    id: Long.UZERO,
    groupPolicyAddress: "",
    metadata: "",
    proposers: [],
    submitTime: new Date(),
    groupVersion: Long.UZERO,
    groupPolicyVersion: Long.UZERO,
    status: 0,
    finalTallyResult: TallyResult.fromPartial({}),
    votingPeriodEnd: new Date(),
    executorResult: 0,
    messages: [],
    title: "",
    summary: ""
  };
}
export const Proposal = {
  typeUrl: "/cosmos.group.v1.Proposal",
  encode(message: Proposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.id.isZero()) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.groupPolicyAddress !== "") {
      writer.uint32(18).string(message.groupPolicyAddress);
    }
    if (message.metadata !== "") {
      writer.uint32(26).string(message.metadata);
    }
    for (const v of message.proposers) {
      writer.uint32(34).string(v!);
    }
    if (message.submitTime !== undefined) {
      Timestamp.encode(toTimestamp(message.submitTime), writer.uint32(42).fork()).ldelim();
    }
    if (!message.groupVersion.isZero()) {
      writer.uint32(48).uint64(message.groupVersion);
    }
    if (!message.groupPolicyVersion.isZero()) {
      writer.uint32(56).uint64(message.groupPolicyVersion);
    }
    if (message.status !== 0) {
      writer.uint32(64).int32(message.status);
    }
    if (message.finalTallyResult !== undefined) {
      TallyResult.encode(message.finalTallyResult, writer.uint32(74).fork()).ldelim();
    }
    if (message.votingPeriodEnd !== undefined) {
      Timestamp.encode(toTimestamp(message.votingPeriodEnd), writer.uint32(82).fork()).ldelim();
    }
    if (message.executorResult !== 0) {
      writer.uint32(88).int32(message.executorResult);
    }
    for (const v of message.messages) {
      Any.encode(v!, writer.uint32(98).fork()).ldelim();
    }
    if (message.title !== "") {
      writer.uint32(106).string(message.title);
    }
    if (message.summary !== "") {
      writer.uint32(114).string(message.summary);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Proposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = (reader.uint64() as Long);
          break;
        case 2:
          message.groupPolicyAddress = reader.string();
          break;
        case 3:
          message.metadata = reader.string();
          break;
        case 4:
          message.proposers.push(reader.string());
          break;
        case 5:
          message.submitTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 6:
          message.groupVersion = (reader.uint64() as Long);
          break;
        case 7:
          message.groupPolicyVersion = (reader.uint64() as Long);
          break;
        case 8:
          message.status = (reader.int32() as any);
          break;
        case 9:
          message.finalTallyResult = TallyResult.decode(reader, reader.uint32());
          break;
        case 10:
          message.votingPeriodEnd = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 11:
          message.executorResult = (reader.int32() as any);
          break;
        case 12:
          message.messages.push(Any.decode(reader, reader.uint32()));
          break;
        case 13:
          message.title = reader.string();
          break;
        case 14:
          message.summary = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Proposal {
    return {
      id: isSet(object.id) ? Long.fromValue(object.id) : Long.UZERO,
      groupPolicyAddress: isSet(object.groupPolicyAddress) ? String(object.groupPolicyAddress) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      proposers: Array.isArray(object?.proposers) ? object.proposers.map((e: any) => String(e)) : [],
      submitTime: isSet(object.submitTime) ? fromJsonTimestamp(object.submitTime) : undefined,
      groupVersion: isSet(object.groupVersion) ? Long.fromValue(object.groupVersion) : Long.UZERO,
      groupPolicyVersion: isSet(object.groupPolicyVersion) ? Long.fromValue(object.groupPolicyVersion) : Long.UZERO,
      status: isSet(object.status) ? proposalStatusFromJSON(object.status) : -1,
      finalTallyResult: isSet(object.finalTallyResult) ? TallyResult.fromJSON(object.finalTallyResult) : undefined,
      votingPeriodEnd: isSet(object.votingPeriodEnd) ? fromJsonTimestamp(object.votingPeriodEnd) : undefined,
      executorResult: isSet(object.executorResult) ? proposalExecutorResultFromJSON(object.executorResult) : -1,
      messages: Array.isArray(object?.messages) ? object.messages.map((e: any) => Any.fromJSON(e)) : [],
      title: isSet(object.title) ? String(object.title) : "",
      summary: isSet(object.summary) ? String(object.summary) : ""
    };
  },
  toJSON(message: Proposal): JsonSafe<Proposal> {
    const obj: any = {};
    message.id !== undefined && (obj.id = (message.id || Long.UZERO).toString());
    message.groupPolicyAddress !== undefined && (obj.groupPolicyAddress = message.groupPolicyAddress);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    if (message.proposers) {
      obj.proposers = message.proposers.map(e => e);
    } else {
      obj.proposers = [];
    }
    message.submitTime !== undefined && (obj.submitTime = message.submitTime.toISOString());
    message.groupVersion !== undefined && (obj.groupVersion = (message.groupVersion || Long.UZERO).toString());
    message.groupPolicyVersion !== undefined && (obj.groupPolicyVersion = (message.groupPolicyVersion || Long.UZERO).toString());
    message.status !== undefined && (obj.status = proposalStatusToJSON(message.status));
    message.finalTallyResult !== undefined && (obj.finalTallyResult = message.finalTallyResult ? TallyResult.toJSON(message.finalTallyResult) : undefined);
    message.votingPeriodEnd !== undefined && (obj.votingPeriodEnd = message.votingPeriodEnd.toISOString());
    message.executorResult !== undefined && (obj.executorResult = proposalExecutorResultToJSON(message.executorResult));
    if (message.messages) {
      obj.messages = message.messages.map(e => e ? Any.toJSON(e) : undefined);
    } else {
      obj.messages = [];
    }
    message.title !== undefined && (obj.title = message.title);
    message.summary !== undefined && (obj.summary = message.summary);
    return obj;
  },
  fromPartial(object: Partial<Proposal>): Proposal {
    const message = createBaseProposal();
    message.id = object.id !== undefined && object.id !== null ? Long.fromValue(object.id) : Long.UZERO;
    message.groupPolicyAddress = object.groupPolicyAddress ?? "";
    message.metadata = object.metadata ?? "";
    message.proposers = object.proposers?.map(e => e) || [];
    message.submitTime = object.submitTime ?? undefined;
    message.groupVersion = object.groupVersion !== undefined && object.groupVersion !== null ? Long.fromValue(object.groupVersion) : Long.UZERO;
    message.groupPolicyVersion = object.groupPolicyVersion !== undefined && object.groupPolicyVersion !== null ? Long.fromValue(object.groupPolicyVersion) : Long.UZERO;
    message.status = object.status ?? 0;
    message.finalTallyResult = object.finalTallyResult !== undefined && object.finalTallyResult !== null ? TallyResult.fromPartial(object.finalTallyResult) : undefined;
    message.votingPeriodEnd = object.votingPeriodEnd ?? undefined;
    message.executorResult = object.executorResult ?? 0;
    message.messages = object.messages?.map(e => Any.fromPartial(e)) || [];
    message.title = object.title ?? "";
    message.summary = object.summary ?? "";
    return message;
  },
  fromAmino(object: ProposalAmino): Proposal {
    const message = createBaseProposal();
    if (object.id !== undefined && object.id !== null) {
      message.id = Long.fromString(object.id);
    }
    if (object.group_policy_address !== undefined && object.group_policy_address !== null) {
      message.groupPolicyAddress = object.group_policy_address;
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = object.metadata;
    }
    message.proposers = object.proposers?.map(e => e) || [];
    if (object.submit_time !== undefined && object.submit_time !== null) {
      message.submitTime = fromTimestamp(Timestamp.fromAmino(object.submit_time));
    }
    if (object.group_version !== undefined && object.group_version !== null) {
      message.groupVersion = Long.fromString(object.group_version);
    }
    if (object.group_policy_version !== undefined && object.group_policy_version !== null) {
      message.groupPolicyVersion = Long.fromString(object.group_policy_version);
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    }
    if (object.final_tally_result !== undefined && object.final_tally_result !== null) {
      message.finalTallyResult = TallyResult.fromAmino(object.final_tally_result);
    }
    if (object.voting_period_end !== undefined && object.voting_period_end !== null) {
      message.votingPeriodEnd = fromTimestamp(Timestamp.fromAmino(object.voting_period_end));
    }
    if (object.executor_result !== undefined && object.executor_result !== null) {
      message.executorResult = object.executor_result;
    }
    message.messages = object.messages?.map(e => Any.fromAmino(e)) || [];
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.summary !== undefined && object.summary !== null) {
      message.summary = object.summary;
    }
    return message;
  },
  toAmino(message: Proposal): ProposalAmino {
    const obj: any = {};
    obj.id = !message.id.isZero() ? message.id.toString() : undefined;
    obj.group_policy_address = message.groupPolicyAddress === "" ? undefined : message.groupPolicyAddress;
    obj.metadata = message.metadata === "" ? undefined : message.metadata;
    if (message.proposers) {
      obj.proposers = message.proposers.map(e => e);
    } else {
      obj.proposers = message.proposers;
    }
    obj.submit_time = message.submitTime ? Timestamp.toAmino(toTimestamp(message.submitTime)) : new Date();
    obj.group_version = !message.groupVersion.isZero() ? message.groupVersion.toString() : undefined;
    obj.group_policy_version = !message.groupPolicyVersion.isZero() ? message.groupPolicyVersion.toString() : undefined;
    obj.status = message.status === 0 ? undefined : message.status;
    obj.final_tally_result = message.finalTallyResult ? TallyResult.toAmino(message.finalTallyResult) : TallyResult.toAmino(TallyResult.fromPartial({}));
    obj.voting_period_end = message.votingPeriodEnd ? Timestamp.toAmino(toTimestamp(message.votingPeriodEnd)) : new Date();
    obj.executor_result = message.executorResult === 0 ? undefined : message.executorResult;
    if (message.messages) {
      obj.messages = message.messages.map(e => e ? Any.toAmino(e) : undefined);
    } else {
      obj.messages = message.messages;
    }
    obj.title = message.title === "" ? undefined : message.title;
    obj.summary = message.summary === "" ? undefined : message.summary;
    return obj;
  },
  fromAminoMsg(object: ProposalAminoMsg): Proposal {
    return Proposal.fromAmino(object.value);
  },
  toAminoMsg(message: Proposal): ProposalAminoMsg {
    return {
      type: "cosmos-sdk/Proposal",
      value: Proposal.toAmino(message)
    };
  },
  fromProtoMsg(message: ProposalProtoMsg): Proposal {
    return Proposal.decode(message.value);
  },
  toProto(message: Proposal): Uint8Array {
    return Proposal.encode(message).finish();
  },
  toProtoMsg(message: Proposal): ProposalProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.Proposal",
      value: Proposal.encode(message).finish()
    };
  }
};
function createBaseTallyResult(): TallyResult {
  return {
    yesCount: "",
    abstainCount: "",
    noCount: "",
    noWithVetoCount: ""
  };
}
export const TallyResult = {
  typeUrl: "/cosmos.group.v1.TallyResult",
  encode(message: TallyResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.yesCount !== "") {
      writer.uint32(10).string(message.yesCount);
    }
    if (message.abstainCount !== "") {
      writer.uint32(18).string(message.abstainCount);
    }
    if (message.noCount !== "") {
      writer.uint32(26).string(message.noCount);
    }
    if (message.noWithVetoCount !== "") {
      writer.uint32(34).string(message.noWithVetoCount);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): TallyResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTallyResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.yesCount = reader.string();
          break;
        case 2:
          message.abstainCount = reader.string();
          break;
        case 3:
          message.noCount = reader.string();
          break;
        case 4:
          message.noWithVetoCount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): TallyResult {
    return {
      yesCount: isSet(object.yesCount) ? String(object.yesCount) : "",
      abstainCount: isSet(object.abstainCount) ? String(object.abstainCount) : "",
      noCount: isSet(object.noCount) ? String(object.noCount) : "",
      noWithVetoCount: isSet(object.noWithVetoCount) ? String(object.noWithVetoCount) : ""
    };
  },
  toJSON(message: TallyResult): JsonSafe<TallyResult> {
    const obj: any = {};
    message.yesCount !== undefined && (obj.yesCount = message.yesCount);
    message.abstainCount !== undefined && (obj.abstainCount = message.abstainCount);
    message.noCount !== undefined && (obj.noCount = message.noCount);
    message.noWithVetoCount !== undefined && (obj.noWithVetoCount = message.noWithVetoCount);
    return obj;
  },
  fromPartial(object: Partial<TallyResult>): TallyResult {
    const message = createBaseTallyResult();
    message.yesCount = object.yesCount ?? "";
    message.abstainCount = object.abstainCount ?? "";
    message.noCount = object.noCount ?? "";
    message.noWithVetoCount = object.noWithVetoCount ?? "";
    return message;
  },
  fromAmino(object: TallyResultAmino): TallyResult {
    const message = createBaseTallyResult();
    if (object.yes_count !== undefined && object.yes_count !== null) {
      message.yesCount = object.yes_count;
    }
    if (object.abstain_count !== undefined && object.abstain_count !== null) {
      message.abstainCount = object.abstain_count;
    }
    if (object.no_count !== undefined && object.no_count !== null) {
      message.noCount = object.no_count;
    }
    if (object.no_with_veto_count !== undefined && object.no_with_veto_count !== null) {
      message.noWithVetoCount = object.no_with_veto_count;
    }
    return message;
  },
  toAmino(message: TallyResult): TallyResultAmino {
    const obj: any = {};
    obj.yes_count = message.yesCount === "" ? undefined : message.yesCount;
    obj.abstain_count = message.abstainCount === "" ? undefined : message.abstainCount;
    obj.no_count = message.noCount === "" ? undefined : message.noCount;
    obj.no_with_veto_count = message.noWithVetoCount === "" ? undefined : message.noWithVetoCount;
    return obj;
  },
  fromAminoMsg(object: TallyResultAminoMsg): TallyResult {
    return TallyResult.fromAmino(object.value);
  },
  toAminoMsg(message: TallyResult): TallyResultAminoMsg {
    return {
      type: "cosmos-sdk/TallyResult",
      value: TallyResult.toAmino(message)
    };
  },
  fromProtoMsg(message: TallyResultProtoMsg): TallyResult {
    return TallyResult.decode(message.value);
  },
  toProto(message: TallyResult): Uint8Array {
    return TallyResult.encode(message).finish();
  },
  toProtoMsg(message: TallyResult): TallyResultProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.TallyResult",
      value: TallyResult.encode(message).finish()
    };
  }
};
function createBaseVote(): Vote {
  return {
    proposalId: Long.UZERO,
    voter: "",
    option: 0,
    metadata: "",
    submitTime: new Date()
  };
}
export const Vote = {
  typeUrl: "/cosmos.group.v1.Vote",
  encode(message: Vote, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.proposalId.isZero()) {
      writer.uint32(8).uint64(message.proposalId);
    }
    if (message.voter !== "") {
      writer.uint32(18).string(message.voter);
    }
    if (message.option !== 0) {
      writer.uint32(24).int32(message.option);
    }
    if (message.metadata !== "") {
      writer.uint32(34).string(message.metadata);
    }
    if (message.submitTime !== undefined) {
      Timestamp.encode(toTimestamp(message.submitTime), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Vote {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVote();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.proposalId = (reader.uint64() as Long);
          break;
        case 2:
          message.voter = reader.string();
          break;
        case 3:
          message.option = (reader.int32() as any);
          break;
        case 4:
          message.metadata = reader.string();
          break;
        case 5:
          message.submitTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Vote {
    return {
      proposalId: isSet(object.proposalId) ? Long.fromValue(object.proposalId) : Long.UZERO,
      voter: isSet(object.voter) ? String(object.voter) : "",
      option: isSet(object.option) ? voteOptionFromJSON(object.option) : -1,
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      submitTime: isSet(object.submitTime) ? fromJsonTimestamp(object.submitTime) : undefined
    };
  },
  toJSON(message: Vote): JsonSafe<Vote> {
    const obj: any = {};
    message.proposalId !== undefined && (obj.proposalId = (message.proposalId || Long.UZERO).toString());
    message.voter !== undefined && (obj.voter = message.voter);
    message.option !== undefined && (obj.option = voteOptionToJSON(message.option));
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.submitTime !== undefined && (obj.submitTime = message.submitTime.toISOString());
    return obj;
  },
  fromPartial(object: Partial<Vote>): Vote {
    const message = createBaseVote();
    message.proposalId = object.proposalId !== undefined && object.proposalId !== null ? Long.fromValue(object.proposalId) : Long.UZERO;
    message.voter = object.voter ?? "";
    message.option = object.option ?? 0;
    message.metadata = object.metadata ?? "";
    message.submitTime = object.submitTime ?? undefined;
    return message;
  },
  fromAmino(object: VoteAmino): Vote {
    const message = createBaseVote();
    if (object.proposal_id !== undefined && object.proposal_id !== null) {
      message.proposalId = Long.fromString(object.proposal_id);
    }
    if (object.voter !== undefined && object.voter !== null) {
      message.voter = object.voter;
    }
    if (object.option !== undefined && object.option !== null) {
      message.option = object.option;
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = object.metadata;
    }
    if (object.submit_time !== undefined && object.submit_time !== null) {
      message.submitTime = fromTimestamp(Timestamp.fromAmino(object.submit_time));
    }
    return message;
  },
  toAmino(message: Vote): VoteAmino {
    const obj: any = {};
    obj.proposal_id = !message.proposalId.isZero() ? message.proposalId.toString() : undefined;
    obj.voter = message.voter === "" ? undefined : message.voter;
    obj.option = message.option === 0 ? undefined : message.option;
    obj.metadata = message.metadata === "" ? undefined : message.metadata;
    obj.submit_time = message.submitTime ? Timestamp.toAmino(toTimestamp(message.submitTime)) : new Date();
    return obj;
  },
  fromAminoMsg(object: VoteAminoMsg): Vote {
    return Vote.fromAmino(object.value);
  },
  toAminoMsg(message: Vote): VoteAminoMsg {
    return {
      type: "cosmos-sdk/Vote",
      value: Vote.toAmino(message)
    };
  },
  fromProtoMsg(message: VoteProtoMsg): Vote {
    return Vote.decode(message.value);
  },
  toProto(message: Vote): Uint8Array {
    return Vote.encode(message).finish();
  },
  toProtoMsg(message: Vote): VoteProtoMsg {
    return {
      typeUrl: "/cosmos.group.v1.Vote",
      value: Vote.encode(message).finish()
    };
  }
};