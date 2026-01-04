import type { PortfolioData } from '@/lib/types';

interface TemplateProps {
    portfolio: PortfolioData;
}

export default function BoldTemplate({ portfolio }: TemplateProps) {
    const { personal, experiences, education, skills } = portfolio;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <header className="relative min-h-screen flex items-center px-6 md:px-12">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600/20 to-transparent" />

                <div className="relative max-w-6xl">
                    <div className="mb-8">
                        {personal.photoUrl ? (
                            <img
                                src={personal.photoUrl}
                                alt={`${personal.firstName} ${personal.lastName}`}
                                className="w-32 h-32 object-cover grayscale contrast-125"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-red-600 flex items-center justify-center text-4xl font-black">
                                {personal.firstName?.[0]}{personal.lastName?.[0]}
                            </div>
                        )}
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-8">
                        {personal.firstName?.toUpperCase()}<br />
                        <span className="text-red-600">{personal.lastName?.toUpperCase()}</span>
                    </h1>

                    <p className="text-2xl md:text-3xl text-white/70 max-w-2xl mb-12">
                        {personal.headline}
                    </p>

                    <div className="flex gap-6 text-sm uppercase tracking-widest">
                        {personal.location && (
                            <span className="text-white/50">{personal.location}</span>
                        )}
                        {personal.email && (
                            <a href={`mailto:${personal.email}`} className="text-red-600 hover:text-red-500 transition-colors">
                                {personal.email}
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* About */}
            {personal.summary && (
                <section className="px-6 md:px-12 py-24 border-t border-white/10">
                    <div className="max-w-4xl">
                        <h2 className="text-sm uppercase tracking-widest text-red-600 mb-8">About</h2>
                        <p className="text-3xl md:text-4xl font-light leading-relaxed text-white/90">
                            {personal.summary}
                        </p>
                    </div>
                </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <section className="px-6 md:px-12 py-24 border-t border-white/10">
                    <h2 className="text-sm uppercase tracking-widest text-red-600 mb-12">Experience</h2>

                    <div className="space-y-0">
                        {experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="py-8 border-b border-white/10 group hover:bg-white/5 transition-colors -mx-6 md:-mx-12 px-6 md:px-12"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-3xl font-bold group-hover:text-red-600 transition-colors">
                                            {exp.title}
                                        </h3>
                                        <p className="text-white/50 text-lg">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-white/30 uppercase tracking-widest whitespace-nowrap">
                                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p className="text-white/60 mt-4 max-w-3xl">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section className="px-6 md:px-12 py-24 border-t border-white/10">
                    <h2 className="text-sm uppercase tracking-widest text-red-600 mb-12">Skills</h2>

                    <div className="flex flex-wrap gap-4">
                        {skills.map((skill, i) => (
                            <span
                                key={i}
                                className="text-2xl font-bold text-white/30 hover:text-white transition-colors cursor-default"
                            >
                                {skill}
                                {i < skills.length - 1 && <span className="text-red-600 ml-4">/</span>}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="px-6 md:px-12 py-24 border-t border-white/10">
                    <h2 className="text-sm uppercase tracking-widest text-red-600 mb-12">Education</h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <h3 className="text-2xl font-bold mb-2">{edu.school}</h3>
                                <p className="text-white/50">{edu.degree} in {edu.field}</p>
                                <p className="text-sm text-white/30 mt-2">
                                    {edu.startDate} — {edu.endDate}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="px-6 md:px-12 py-12 border-t border-white/10">
                <div className="flex justify-between items-center">
                    <span className="text-white/30 text-sm">
                        © {new Date().getFullYear()} All rights reserved
                    </span>
                    <span className="text-red-600 text-sm font-bold">DESIGNPORTFOL.IO</span>
                </div>
            </footer>
        </div>
    );
}
