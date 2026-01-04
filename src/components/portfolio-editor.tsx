'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PortfolioData, Experience, Education } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface PortfolioEditorProps {
    data: Partial<PortfolioData>;
    onChange: (data: Partial<PortfolioData>) => void;
}

export default function PortfolioEditor({ data, onChange }: PortfolioEditorProps) {
    const [expandedExperience, setExpandedExperience] = useState<string | null>(
        data.experiences?.[0]?.id || null
    );
    const [expandedEducation, setExpandedEducation] = useState<string | null>(
        data.education?.[0]?.id || null
    );
    const [newSkill, setNewSkill] = useState('');

    // Personal Info updates
    const updatePersonal = (field: string, value: string) => {
        onChange({
            ...data,
            personal: { ...data.personal!, [field]: value }
        });
    };

    // Experience updates
    const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
        onChange({
            ...data,
            experiences: data.experiences?.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        });
    };

    const addExperience = () => {
        const newExp: Experience = {
            id: uuidv4(),
            company: '',
            title: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        };
        onChange({
            ...data,
            experiences: [newExp, ...(data.experiences || [])]
        });
        setExpandedExperience(newExp.id);
    };

    const removeExperience = (id: string) => {
        onChange({
            ...data,
            experiences: data.experiences?.filter(exp => exp.id !== id)
        });
    };

    // Education updates
    const updateEducation = (id: string, field: keyof Education, value: string) => {
        onChange({
            ...data,
            education: data.education?.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        });
    };

    const addEducation = () => {
        const newEdu: Education = {
            id: uuidv4(),
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: ''
        };
        onChange({
            ...data,
            education: [newEdu, ...(data.education || [])]
        });
        setExpandedEducation(newEdu.id);
    };

    const removeEducation = (id: string) => {
        onChange({
            ...data,
            education: data.education?.filter(edu => edu.id !== id)
        });
    };

    // Skills updates
    const addSkill = () => {
        if (newSkill.trim()) {
            onChange({
                ...data,
                skills: [...(data.skills || []), newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const removeSkill = (index: number) => {
        onChange({
            ...data,
            skills: data.skills?.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-8">
            {/* Personal Information */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">👤</span>
                    Personal Information
                </h2>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={data.personal?.firstName || ''}
                                onChange={e => updatePersonal('firstName', e.target.value)}
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={data.personal?.lastName || ''}
                                onChange={e => updatePersonal('lastName', e.target.value)}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="headline">Professional Headline</Label>
                        <Input
                            id="headline"
                            value={data.personal?.headline || ''}
                            onChange={e => updatePersonal('headline', e.target.value)}
                            placeholder="Senior Software Engineer at Google"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.personal?.email || ''}
                                onChange={e => updatePersonal('email', e.target.value)}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={data.personal?.location || ''}
                                onChange={e => updatePersonal('location', e.target.value)}
                                placeholder="San Francisco, CA"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="summary">About / Summary</Label>
                        <Textarea
                            id="summary"
                            value={data.personal?.summary || ''}
                            onChange={e => updatePersonal('summary', e.target.value)}
                            placeholder="Tell your story..."
                            rows={4}
                        />
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">💼</span>
                        Experience
                        <span className="text-sm font-normal text-muted-foreground">
                            ({data.experiences?.length || 0})
                        </span>
                    </h2>
                    <Button variant="outline" size="sm" onClick={addExperience}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>

                <div className="space-y-3">
                    {data.experiences?.map((exp) => (
                        <div
                            key={exp.id}
                            className="bg-card border border-border rounded-xl overflow-hidden"
                        >
                            {/* Header - always visible */}
                            <button
                                className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
                                onClick={() => setExpandedExperience(expandedExperience === exp.id ? null : exp.id)}
                            >
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                        {exp.title || 'New Position'}
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate">
                                        {exp.company || 'Company'} • {exp.startDate || 'Start'} - {exp.current ? 'Present' : exp.endDate || 'End'}
                                    </div>
                                </div>
                                {expandedExperience === exp.id ? (
                                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>

                            {/* Expanded content */}
                            {expandedExperience === exp.id && (
                                <div className="p-4 pt-0 space-y-4 border-t border-border">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Job Title</Label>
                                            <Input
                                                value={exp.title}
                                                onChange={e => updateExperience(exp.id, 'title', e.target.value)}
                                                placeholder="Software Engineer"
                                            />
                                        </div>
                                        <div>
                                            <Label>Company</Label>
                                            <Input
                                                value={exp.company}
                                                onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                                                placeholder="Google"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Start Date</Label>
                                            <Input
                                                value={exp.startDate}
                                                onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                                                placeholder="January 2020"
                                            />
                                        </div>
                                        <div>
                                            <Label>End Date</Label>
                                            <Input
                                                value={exp.endDate || ''}
                                                onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                                                placeholder="Present"
                                                disabled={exp.current}
                                            />
                                        </div>
                                        <div>
                                            <Label>Location</Label>
                                            <Input
                                                value={exp.location || ''}
                                                onChange={e => updateExperience(exp.id, 'location', e.target.value)}
                                                placeholder="San Francisco, CA"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`current-${exp.id}`}
                                            checked={exp.current}
                                            onChange={e => updateExperience(exp.id, 'current', e.target.checked)}
                                            className="rounded"
                                        />
                                        <Label htmlFor={`current-${exp.id}`} className="font-normal cursor-pointer">
                                            I currently work here
                                        </Label>
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            value={exp.description}
                                            onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                                            placeholder="Describe your responsibilities and achievements..."
                                            rows={4}
                                        />
                                    </div>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeExperience(exp.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Remove this position
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}

                    {(!data.experiences || data.experiences.length === 0) && (
                        <div className="bg-muted/50 rounded-xl p-8 text-center text-muted-foreground">
                            <p>No experience added yet.</p>
                            <Button variant="outline" size="sm" className="mt-4" onClick={addExperience}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add your first position
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">🎓</span>
                        Education
                        <span className="text-sm font-normal text-muted-foreground">
                            ({data.education?.length || 0})
                        </span>
                    </h2>
                    <Button variant="outline" size="sm" onClick={addEducation}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>

                <div className="space-y-3">
                    {data.education?.map((edu) => (
                        <div
                            key={edu.id}
                            className="bg-card border border-border rounded-xl overflow-hidden"
                        >
                            {/* Header */}
                            <button
                                className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
                                onClick={() => setExpandedEducation(expandedEducation === edu.id ? null : edu.id)}
                            >
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                        {edu.school || 'New School'}
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate">
                                        {edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''}
                                    </div>
                                </div>
                                {expandedEducation === edu.id ? (
                                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>

                            {/* Expanded content */}
                            {expandedEducation === edu.id && (
                                <div className="p-4 pt-0 space-y-4 border-t border-border">
                                    <div>
                                        <Label>School / University</Label>
                                        <Input
                                            value={edu.school}
                                            onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                                            placeholder="Stanford University"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Degree</Label>
                                            <Input
                                                value={edu.degree}
                                                onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                                                placeholder="Bachelor of Science"
                                            />
                                        </div>
                                        <div>
                                            <Label>Field of Study</Label>
                                            <Input
                                                value={edu.field}
                                                onChange={e => updateEducation(edu.id, 'field', e.target.value)}
                                                placeholder="Computer Science"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Start Date</Label>
                                            <Input
                                                value={edu.startDate}
                                                onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                                                placeholder="September 2016"
                                            />
                                        </div>
                                        <div>
                                            <Label>End Date</Label>
                                            <Input
                                                value={edu.endDate || ''}
                                                onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                                                placeholder="June 2020"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeEducation(edu.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Remove this education
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}

                    {(!data.education || data.education.length === 0) && (
                        <div className="bg-muted/50 rounded-xl p-8 text-center text-muted-foreground">
                            <p>No education added yet.</p>
                            <Button variant="outline" size="sm" className="mt-4" onClick={addEducation}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add your education
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Skills */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">⚡</span>
                    Skills
                    <span className="text-sm font-normal text-muted-foreground">
                        ({data.skills?.length || 0})
                    </span>
                </h2>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    {/* Add new skill */}
                    <div className="flex gap-2">
                        <Input
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            placeholder="Add a skill..."
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button variant="outline" onClick={addSkill}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Skills list */}
                    <div className="flex flex-wrap gap-2">
                        {data.skills?.map((skill, index) => (
                            <span
                                key={index}
                                className="group flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-full text-sm"
                            >
                                {skill}
                                <button
                                    onClick={() => removeSkill(index)}
                                    className="w-4 h-4 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>

                    {(!data.skills || data.skills.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No skills added yet. Type a skill above and press Enter.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
