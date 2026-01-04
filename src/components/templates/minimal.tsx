import type { PortfolioData } from '@/lib/types';

interface TemplateProps {
    portfolio: PortfolioData;
}

export default function MinimalTemplate({ portfolio }: TemplateProps) {
    const { personal, experiences, education, skills } = portfolio;

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <header className="max-w-3xl mx-auto px-6 py-20 text-center">
                {personal.photoUrl && (
                    <img
                        src={personal.photoUrl}
                        alt={`${personal.firstName} ${personal.lastName}`}
                        className="w-32 h-32 rounded-full mx-auto mb-6 object-cover grayscale"
                    />
                )}
                <h1 className="text-5xl font-light tracking-tight mb-4">
                    {personal.firstName} {personal.lastName}
                </h1>
                <p className="text-xl text-gray-500 mb-6">{personal.headline}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    {personal.location && <span>{personal.location}</span>}
                    {personal.email && (
                        <>
                            <span>•</span>
                            <a href={`mailto:${personal.email}`} className="hover:text-gray-600 transition-colors">
                                {personal.email}
                            </a>
                        </>
                    )}
                </div>
            </header>

            {/* About */}
            {personal.summary && (
                <section className="max-w-2xl mx-auto px-6 py-12 border-t border-gray-100">
                    <p className="text-lg leading-relaxed text-gray-600">{personal.summary}</p>
                </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <section className="max-w-2xl mx-auto px-6 py-12 border-t border-gray-100">
                    <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-8">Experience</h2>
                    <div className="space-y-8">
                        {experiences.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium">{exp.title}</h3>
                                        <p className="text-gray-500">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="max-w-2xl mx-auto px-6 py-12 border-t border-gray-100">
                    <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-8">Education</h2>
                    <div className="space-y-6">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <h3 className="font-medium">{edu.school}</h3>
                                <p className="text-gray-500">{edu.degree} in {edu.field}</p>
                                <span className="text-sm text-gray-400">
                                    {edu.startDate} — {edu.endDate}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section className="max-w-2xl mx-auto px-6 py-12 border-t border-gray-100">
                    <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-8">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 text-sm border border-gray-200 rounded-full text-gray-600"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="max-w-2xl mx-auto px-6 py-12 border-t border-gray-100 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} {personal.firstName} {personal.lastName}
            </footer>
        </div>
    );
}
