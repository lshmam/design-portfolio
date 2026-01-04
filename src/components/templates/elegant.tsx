import type { PortfolioData } from '@/lib/types';

interface TemplateProps {
    portfolio: PortfolioData;
}

export default function ElegantTemplate({ portfolio }: TemplateProps) {
    const { personal, experiences, education, skills } = portfolio;

    return (
        <div className="min-h-screen bg-amber-50 text-amber-950" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header */}
            <header className="max-w-3xl mx-auto px-6 py-24 text-center">
                <div className="mb-8">
                    <svg className="w-12 h-12 mx-auto text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
                    </svg>
                </div>

                {personal.photoUrl ? (
                    <img
                        src={personal.photoUrl}
                        alt={`${personal.firstName} ${personal.lastName}`}
                        className="w-36 h-36 rounded-full mx-auto mb-8 object-cover ring-4 ring-amber-200 sepia-[.3]"
                    />
                ) : (
                    <div className="w-36 h-36 rounded-full mx-auto mb-8 bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center text-4xl text-amber-700">
                        {personal.firstName?.[0]}{personal.lastName?.[0]}
                    </div>
                )}

                <h1 className="text-5xl md:text-6xl font-normal tracking-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                    {personal.firstName} {personal.lastName}
                </h1>

                <p className="text-xl text-amber-700 italic mb-8">{personal.headline}</p>

                <div className="flex items-center justify-center gap-6 text-sm text-amber-600">
                    {personal.location && <span>{personal.location}</span>}
                    {personal.email && (
                        <>
                            <span className="text-amber-300">✦</span>
                            <a href={`mailto:${personal.email}`} className="hover:text-amber-800 underline underline-offset-4 decoration-amber-300 transition-colors">
                                {personal.email}
                            </a>
                        </>
                    )}
                </div>
            </header>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-4 py-4">
                <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-300" />
                <span className="text-amber-400">✦</span>
                <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-300" />
            </div>

            {/* About */}
            {personal.summary && (
                <section className="max-w-2xl mx-auto px-6 py-16 text-center">
                    <p className="text-xl leading-relaxed text-amber-800 italic">
                        &ldquo;{personal.summary}&rdquo;
                    </p>
                </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <section className="max-w-3xl mx-auto px-6 py-16">
                    <h2 className="text-center text-sm uppercase tracking-[0.3em] text-amber-600 mb-12">
                        Professional Journey
                    </h2>

                    <div className="space-y-12">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="text-center">
                                <div className="inline-block px-4 py-1 bg-amber-100 rounded-full text-xs uppercase tracking-wider text-amber-600 mb-4">
                                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                </div>
                                <h3 className="text-2xl font-normal mb-2">{exp.title}</h3>
                                <p className="text-amber-600 italic mb-4">{exp.company}</p>
                                {exp.description && (
                                    <p className="text-amber-700 max-w-xl mx-auto">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-4 py-4">
                <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-300" />
                <span className="text-amber-400">✦</span>
                <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-300" />
            </div>

            {/* Education & Skills */}
            <section className="max-w-4xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Education */}
                    {education.length > 0 && (
                        <div className="text-center">
                            <h2 className="text-sm uppercase tracking-[0.3em] text-amber-600 mb-8">
                                Education
                            </h2>
                            <div className="space-y-6">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="text-xl font-normal">{edu.school}</h3>
                                        <p className="text-amber-600 italic">{edu.degree}</p>
                                        <p className="text-sm text-amber-500">{edu.field}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="text-center">
                            <h2 className="text-sm uppercase tracking-[0.3em] text-amber-600 mb-8">
                                Expertise
                            </h2>
                            <div className="flex flex-wrap justify-center gap-2">
                                {skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-1 border border-amber-300 rounded-full text-sm text-amber-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-3xl mx-auto px-6 py-16 text-center">
                <div className="mb-4">
                    <svg className="w-8 h-8 mx-auto text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
                    </svg>
                </div>
                <p className="text-sm text-amber-500 italic">
                    Crafted with elegance by DesignPortfol.io
                </p>
            </footer>
        </div>
    );
}
