"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { Card, CardContent } from "@/components/tailgrids/core/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLogin } from "@/utils/login";

const SKILLS = {
  Programming: [
    "HTML",
    "CSS",
    "jQuery",
    "JavaScript",
    "PHP",
    "Laravel",
    "Node.js",
    "Next.js",
    "Vue.js",
    "Tailwind",
  ],
  "Database & Tools": [
    "PostgreSQL",
    "MySQL",
    "Supabase",
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Docker",
  ],
};

const EXPERIENCE = [
  {
    title: "Pharmacy Management System",
    type: "Internship",
    points: [
      "Collaborated with a team of five members on a pharmacy management system project, contributing to system development, database design, and business requirement analysis to deliver user-focused and scalable solutions.",
      "Researched and developed an automated website deployment system, including SSL certificate setup, server and domain configuration, and database duplication to onboard new pharmacy stores efficiently.",
      "Developed a reusable library to simplify input selection processes by enabling automatic data creation when records do not exist, reducing the need for manual database queries.",
      "Developed a receipt printer configuration feature that allows users to customize paper margins, font sizes, and print spacing to improve printing flexibility and support different receipt formats.",
    ],
  },
  {
    title: "Retail Management System for Buddhist Products",
    type: "Freelance",
    points: [
      "Developed two retail systems for Buddhist product sales, collaborating directly with clients to gather requirements, analyze business needs, and design system architecture and database structures based on client requirements.",
      "Developed an automated payment verification system integrated with MoneySpace and SlipOK to validate payment transactions and improve operational efficiency.",
      "Implemented cache management strategies to improve system performance, reduce database workload, and enhance scalability for increased user traffic on a small-scale private server.",
    ],
  },
  {
    title: "Vocational College Website and Content Management System",
    type: "Freelance",
    points: [
      "Collaborated with clients to gather requirements, analyze business needs, and design system architecture and database structures aligned with project goals.",
      "Designed a dynamic menu management system that allows users to add, remove, and customize page layouts using a parent-child menu structure to support flexible content organization.",
      "Implemented role-based access control (RBAC) to manage content permissions for different departments, ensuring appropriate access and content management responsibilities across the college.",
    ],
  },
];

const CERTIFICATES = [
  { title: "The First of Computer Programming Skill", year: "2024" },
  { title: "The First of Network Technology Skill", year: "2025" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-bold tracking-[0.16em] uppercase text-title-50">
        {children}
      </h2>
      <div className="mt-2 h-px w-full bg-base-200" />
    </div>
  );
}

export default function ResumeHome() {
  const router = useRouter();

  useEffect(() => {
    isLogin(router, '/');
  }, [router])
  return (
    <Card className="border border-base-200 shadow-sm overflow-hidden bg-white">
      <CardContent className="p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="flex flex-col items-start gap-4">
            <div className="flex w-full max-w-[220px] aspect-square items-center justify-center rounded-md bg-zinc-800 text-white text-5xl font-bold tracking-wider">
              TK
            </div>
            <div className="text-sm leading-6 text-title-50">
              <p className="font-bold text-base">Thanawat Ketiya (Student)</p>
              <p className="mt-1 text-text-100">
                Computer Science and Software Development Innovation Dept. (
                <span className="font-semibold text-title-50">CSI</span>)
              </p>
              <p className="text-text-100">
                School of Information Technology (
                <span className="font-semibold text-title-50">SIT</span>)
              </p>
              <p className="text-text-100">
                Sripatum University (
                <span className="font-semibold text-title-50">SPU</span>)
              </p>
            </div>

            <div className="text-sm text-text-100 leading-6 space-y-1">
              <p>
                <a
                  href="tel:+66943636953"
                  className="hover:text-blue-600 transition"
                >
                  +6694-363-6953
                </a>
              </p>
              <p>
                <a
                  href="mailto:thanawatketiya@gmail.com"
                  className="hover:text-blue-600 transition"
                >
                  thanawatketiya@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="https://www.linkedin.com/in/thanawatketiya"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 transition"
                >
                  LinkedIn: Thanawat Ketiya
                </a>
              </p>
              <p className="pt-1 text-xs leading-5">
                42/310, 624 Condolette Building B, Ratchadaphisek 36 Alley, Chan
                Kasem, Chatuchak, Bangkok 10900
              </p>
            </div>
          </aside>

          <section className="relative min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-title-50 leading-snug tracking-wide uppercase">
              Thanawat Ketiya
            </h1>
            <p className="mt-1 text-sm text-text-100">
              Resume — Front-End / Full-Stack Developer
            </p>

            <div className="mt-6">
              <SectionTitle>About Me</SectionTitle>
              <p className="text-sm text-text-100 leading-7">
                I&apos;ve loved spending time around computers since I was a kid.
                As I got older, I started asking myself what I really wanted to
                do in the future and whether I still enjoyed working with
                computers. After exploring and learning many things. Because of
                that, I decided to seriously study this field starting from the
                age of 15, and I&apos;ve continued improving my skills and
                building projects ever since. I&apos;ve learned through
                studying, competitions, personal projects, freelance work, and
                even small systems that I created on my own. In the future, I
                want to keep learning and improving myself so I can create
                high-quality systems and meaningful work for users and the
                organizations I get the chance to work with.
              </p>
            </div>

            <div className="mt-6">
              <SectionTitle>Skills</SectionTitle>
              <div className="flex flex-col gap-3">
                {Object.entries(SKILLS).map(([group, items]) => (
                  <div key={group}>
                    <p className="text-sm font-semibold text-title-50 mb-2">
                      {group}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <Badge key={skill} color="gray" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <SectionTitle>Experience</SectionTitle>
              <div className="flex flex-col gap-5">
                {EXPERIENCE.map((job) => (
                  <article key={job.title}>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-title-50">
                        {job.title}
                      </h3>
                      <Badge
                        color={job.type === "Internship" ? "blue" : "success"}
                        size="sm"
                      >
                        {job.type}
                      </Badge>
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-text-100 leading-6">
                      {job.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <SectionTitle>Education</SectionTitle>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-title-50 text-sm">
                    Sripatum University
                  </p>
                  <p className="mt-1 text-sm text-text-100 leading-6">
                    Bachelor Degree-Regular, Computer Science and Software
                    Development Innovation
                  </p>
                </div>
                <Badge color="primary" size="sm">
                  Now
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <SectionTitle>Certificate</SectionTitle>
              <ul className="flex flex-col gap-2">
                {CERTIFICATES.map((cert) => (
                  <li
                    key={cert.title}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm"
                  >
                    <span className="font-medium text-title-50">
                      {cert.title}
                    </span>
                    <span className="text-text-100 tabular-nums">
                      {cert.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
