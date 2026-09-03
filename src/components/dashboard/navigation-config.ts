import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  FolderKanban,
  Headphones,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  UserRound,
  UserRoundSearch,
  Video,
} from "lucide-react";

export type UserRole = "candidate" | "recruiter" | "admin";

export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export const navigation: Record<UserRole, NavigationGroup[]> = {
  candidate: [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/candidate/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Jobs",
          href: "/candidate/jobs",
          icon: Search,
        },
        {
          label: "Applications",
          href: "/candidate/applications",
          icon: BriefcaseBusiness,
        },
      ],
    },

    {
      title: "AI Career",
      items: [
        {
          label: "Resume AI",
          href: "/candidate/resumes",
          icon: FileText,
        },
        {
          label: "Job Matches",
          href: "/candidate/matches",
          icon: Target,
          badge: "AI",
        },
        {
          label: "AI Interview",
          href: "/candidate/ai-interview",
          icon: Video,
          badge: "AI",
        },
      ],
    },

    {
      title: "Communication",
      items: [
        {
          label: "Messages",
          href: "/candidate/messages",
          icon: MessageSquare,
        },
        {
          label: "Interviews",
          href: "/candidate/interviews",
          icon: CalendarDays,
        },
      ],
    },

    {
      title: "Settings",
      items: [
        {
          label: "Profile",
          href: "/candidate/profile",
          icon: UserRound,
        },
        {
          label: "Settings",
          href: "/candidate/settings",
          icon: Settings,
        },
      ],
    },
  ],

  recruiter: [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/recruiter/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Jobs",
          href: "/recruiter/jobs",
          icon: BriefcaseBusiness,
        },
        {
          label: "Applications",
          href: "/recruiter/applications",
          icon: FolderKanban,
        },
      ],
    },

    {
      title: "Talent",
      items: [
        {
          label: "Candidates",
          href: "/recruiter/candidates",
          icon: Users,
        },
        {
          label: "AI Matches",
          href: "/recruiter/ai-matches",
          icon: Target,
          badge: "AI",
        },
        {
          label: "Rank Candidates",
          href: "/recruiter/rank-candidates",
          icon: Sparkles,
          badge: "AI",
        },
      ],
    },

    {
      title: "Communication",
      items: [
        {
          label: "Messages",
          href: "/recruiter/messages",
          icon: MessageSquare,
        },
        {
          label: "Interviews",
          href: "/recruiter/interviews",
          icon: CalendarDays,
        },
      ],
    },

    {
      title: "Company",
      items: [
        {
          label: "Company Profile",
          href: "/recruiter/company",
          icon: Building2,
        },
        {
          label: "Settings",
          href: "/recruiter/settings",
          icon: Settings,
        },
      ],
    },
  ],

  admin: [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
        },
      ],
    },

    {
      title: "Management",
      items: [
        {
          label: "Users",
          href: "/admin/users",
          icon: Users,
        },
        {
          label: "Candidates",
          href: "/admin/candidates",
          icon: UserRoundSearch,
        },
        {
          label: "Recruiters",
          href: "/admin/recruiters",
          icon: Users,
        },
        {
          label: "Companies",
          href: "/admin/companies",
          icon: Building2,
        },
        {
          label: "Jobs",
          href: "/admin/jobs",
          icon: BriefcaseBusiness,
        },
      ],
    },

    {
      title: "System",
      items: [
        {
          label: "Reports",
          href: "/admin/reports",
          icon: BarChart3,
        },
        {
          label: "AI System",
          href: "/admin/ai-system",
          icon: Sparkles,
          badge: "AI",
        },
        {
          label: "Support",
          href: "/admin/support",
          icon: Headphones,
        },
      ],
    },

    {
      title: "Settings",
      items: [
        {
          label: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
        {
          label: "Security",
          href: "/admin/security",
          icon: ShieldCheck,
        },
      ],
    },
  ],
};