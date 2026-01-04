import type { PortfolioData } from '@/lib/types';

interface TemplateProps {
    portfolio: PortfolioData;
}

export default function ModernTemplate({ portfolio }: TemplateProps) {
    const { personal, experiences, education, skills } = portfolio;

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Hero */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />

                <div className="relative max-w-6xl mx-auto px-6 py-24">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {personal.photoUrl ? (
                            <img
                                src={personal.photoUrl}
                                alt={`${personal.firstName} ${personal.lastName}`}
                                className="w-40 h-40 rounded-2xl object-cover ring-4 ring-white/10"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-5xl font-bold">
                                {personal.firstName?.[0]}{personal.lastName?.[0]}
                            </div>
                        )}

                        <div className="text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-bold mb-4">
                                {personal.firstName}{' '}
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    {personal.lastName}
                                </span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-4">{personal.headline}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                                {personal.location && (
                                    <span className="flex items-center gap-1">
                                        📍 {personal.location}
                                    </span>
                                )}
                                {personal.email && (
                                    <a href={`mailto:${personal.email}`} className="flex items-center gap-1 hover:text-white transition-colors">
                                        ✉️ {personal.email}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* About */}
            {personal.summary && (
                <section className="max-w-6xl mx-auto px-6 py-12">
                    <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
                        <h2 className="text-sm uppercase tracking-widest text-indigo-400 mb-4">About</h2>
                        <p className="text-lg leading-relaxed text-slate-300">{personal.summary}</p>
                    </div>
                </section>
            )}

            {/* Bento Grid */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Experience Cards */}
                    {experiences.slice(0, 3).map((exp, i) => (
                        <div
                            key={exp.id}
                            className={`bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 transition-colors ${i === 0 ? 'md:col-span-2' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl">
                                    💼
                                </div>
                                <span className="text-xs text-slate-500">
                                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-1">{exp.title}</h3>
                            <p className="text-indigo-400 text-sm mb-3">{exp.company}</p>
                            {exp.description && (
                                <p className="text-sm text-slate-400 line-clamp-3">{exp.description}</p>
                            )}
                        </div>
                    ))}

                    {/* Skills Card */}
                    {skills.length > 0 && (
                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                            <h3 className="text-sm uppercase tracking-widest text-indigo-400 mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.slice(0, 10).map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-sm bg-slate-800 rounded-lg text-slate-300"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education Card */}
                    {education.length > 0 && (
                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 md:col-span-2 lg:col-span-1">
                            <h3 className="text-sm uppercase tracking-widest text-indigo-400 mb-4">Education</h3>
                            <div className="space-y-4">
                                {education.slice(0, 2).map((edu) => (
                                    <div key={edu.id}>
                                        <h4 className="font-medium">{edu.school}</h4>
                                        <p className="text-sm text-slate-400">{edu.degree} in {edu.field}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto px-6 py-12 text-center">
                <div className="text-sm text-slate-500">
                    Built with <span className="text-indigo-400">DesignPortfol.io</span>
                </div>
            </footer>
        </div>
    );
}
