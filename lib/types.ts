import { Timestamp } from 'firebase/firestore';

// ─── App Config ──────────────────────────────────────────────
export interface AppConfig {
  imagePostingEnabled: boolean;
  commentModerationEnabled: boolean;
  pollCreationEnabled: boolean;
  electionStates: string[]; // State codes with ongoing elections
}

// ─── User ────────────────────────────────────────────────────
export type Role = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: Role;
  state?: string;
  constituency?: string;
  isRegisteredVoter?: boolean;
  isVerified?: boolean;
  createdAt: Timestamp | number;
  updatedAt?: Timestamp | number;
}

// ─── Leader ──────────────────────────────────────────────────
export type Chamber = 'Lok Sabha' | 'Rajya Sabha' | 'Vidhan Sabha' | 'Vidhan Parishad';
export type LeaderType = 'MP_LS' | 'MP_RS' | 'MLA' | 'MLC';

export interface Leader {
  id: string;
  name: string;
  party: string;
  photoURL?: string;
  state: string;
  constituency: string;
  type: LeaderType;
  chamber: Chamber;
  agreeCount: number;
  funnyCount: number;
  commentCount: number;
  searchTokens: string[];
  createdAt: Timestamp | number;
}

// ─── Post ────────────────────────────────────────────────────
export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  isVerified?: boolean;
  leaderId?: string;
  leaderName?: string;
  leaderType?: string;
  topicId?: string;
  topicTitle?: string;
  content: string; // max 500 chars
  imageURL?: string;
  agreeCount: number;
  funnyCount: number;
  commentCount: number;
  isApproved: boolean;
  createdAt: Timestamp | number;
  updatedAt?: Timestamp | number;
}

// ─── Comment ─────────────────────────────────────────────────
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string; // max 500 top-level, max 50 reply
  isReply: boolean;
  parentCommentId?: string;
  agreeCount: number;
  funnyCount: number;
  isApproved: boolean;
  createdAt: Timestamp | number;
}

// ─── Reaction ────────────────────────────────────────────────
export type ReactionType = 'agree' | 'funny';

export interface Reaction {
  id: string;
  userId: string;
  targetType: 'post' | 'comment' | 'leader';
  targetId: string;
  type: ReactionType;
  createdAt: Timestamp | number;
}

// ─── Topic ───────────────────────────────────────────────────
export type TopicCategory = 'general' | 'election' | 'policy' | 'scandal';

export interface Topic {
  id: string;
  title: string;
  description?: string;
  isTrending: boolean;
  trendScore: number;
  category: TopicCategory;
  relatedState?: string;
  postCount: number;
  createdAt: Timestamp | number;
}

// ─── Poll ────────────────────────────────────────────────────
export type ElectionType = 'state' | 'national' | 'bypoll';

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdByName?: string;
  isAdmin: boolean;
  isFeatured: boolean;
  isElectionPoll: boolean;
  electionState?: string;
  electionConstituency?: string;
  electionType?: ElectionType;
  topicId?: string;
  leaderId?: string;
  totalVotes: number;
  residentVotes: number;
  nonResidentVotes: number;
  expiresAt?: Timestamp | number;
  createdAt: Timestamp | number;
}

export interface PollVote {
  optionIndex: number;
  isResident?: boolean;
  isConstituencyResident?: boolean;
  canVoteInElection?: boolean;
  votedAt: Timestamp | number;
}

// ─── Admin ───────────────────────────────────────────────────
export interface AdminDoc {
  email: string;
  addedAt: Timestamp | number;
  addedBy?: string;
}
