import type { PortfolioData } from '@/lib/types';

interface TemplateProps {
    portfolio: PortfolioData;
}

export default function CreativeTemplate({ portfolio }: TemplateProps) {
    const { personal, experiences, education, skills } = portfolio;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-fuchsia-900 text-white overflow-hidden">
            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative">
                {/* Hero */}
                <header className="min-h-screen flex items-center justify-center px-6">
                    <div className="text-center">
                        {personal.photoUrl ? (
                            <img
                                src={personal.photoUrl}
                                alt={`${personal.firstName} ${personal.lastName}`}
                                className="w-48 h-48 rounded-full mx-auto mb-8 object-cover ring-4 ring-white/20 shadow-2xl"
                            />
                        ) : (
                            <div className="w-48 h-48 rounded-full mx-auto mb-8 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center text-6xl font-bold shadow-2xl">
                                {personal.firstName?.[0]}{personal.lastName?.[0]}
                            </div>
                        )}

                        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
                            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                {personal.firstName}
                            </span>
                            <span className="block text-white/90">{personal.lastName}</span>
                        </h1>

                        <p className="text-2xl text-white/70 mb-8 max-w-xl mx-auto">
                            {personal.headline}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-white/60">
                            {personal.location && (
                                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
                                    📍 {personal.location}
                                </span>
                            )}
                            {personal.email && (
                                <a
                                    href={`mailto:${personal.email}`}
                                    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
                                >
                                    ✉️ Contact Me
                                </a>
                            )}
                        </div>

                        {/* Scroll Indicator */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                            <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
                                <div className="w-1 h-3 bg-white/50 rounded-full" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* About */}
                {personal.summary && (
                    <section className="max-w-4xl mx-auto px-6 py-24">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10">
                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                About Me
                            </h2>
                            <p className="text-xl leading-relaxed text-white/80">{personal.summary}</p>
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                    <section className="max-w-4xl mx-auto px-6 py-12">
                        <h2 className="text-3xl font-bold mb-12 text-center">
                            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                                Experience
                            </span>
                        </h2>

                        <div className="space-y-6">
                            {experiences.map((exp, i) => (
                                <div
                                    key={exp.id}
                                    className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-pink-500 before:to-cyan-500 before:rounded-full"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 -translate-x-1" />

                                    <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold">{exp.title}</h3>
                                                <p className="text-pink-400">{exp.company}</p>
                                            </div>
                                            <span className="text-sm text-white/50 bg-white/10 px-3 py-1 rounded-full">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p className="text-white/70">{exp.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <section className="max-w-4xl mx-auto px-6 py-24">
                        <h2 className="text-3xl font-bold mb-12 text-center">
                            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                Skills
                            </span>
                        </h2>

                        <div className="flex flex-wrap justify-center gap-3">
                            {skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border border-white/10 backdrop-blur text-white/90 hover:scale-105 transition-transform cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="text-center py-12 text-white/40">
                    <p>Crafted with ✨ by DesignPortfol.io</p>
                </footer>
            </div>
        </div>
    );
}
