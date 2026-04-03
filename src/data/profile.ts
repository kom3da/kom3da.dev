export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Profile {
  name: string;
  nameEn: string;
  jobTitle: string;
  bio: string;
  url: string;
  links: { label: string; url: string }[];
  skills: Skill[];
}

const profile: Profile = {
  name: "Komeda Ryuichi",
  nameEn: "Ryuichi Komeda",
  jobTitle: "Software Engineer",
  bio: "ソフトウェアエンジニア。Webアプリケーションの設計・開発に携わっています。",
  url: "https://kom3da.dev",
  links: [
    { label: "GitHub", url: "https://github.com/kom3da" },
  ],
  skills: [
    { id: "typescript", name: "TypeScript", category: "Language" },
    { id: "go", name: "Go", category: "Language" },
    { id: "react", name: "React", category: "Frontend" },
    { id: "nextjs", name: "Next.js", category: "Frontend" },
    { id: "vue", name: "Vue", category: "Frontend" },
    { id: "nodejs", name: "Node.js", category: "Backend" },
    { id: "docker", name: "Docker / K8s", category: "Infrastructure" },
    { id: "aws", name: "AWS", category: "Infrastructure" },
    { id: "cloudflare-workers", name: "Cloudflare Workers", category: "Infrastructure" },
  ],
};

export default profile;
