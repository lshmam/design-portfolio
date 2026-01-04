'use client';

import { useState } from 'react';
import {
    Palette,
    User,
    Link2,
    FileText,
    Briefcase,
    GraduationCap,
    Sparkles,
    ChevronRight,
    GripVertical,
    Plus,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PortfolioData, TemplateStyle, Experience, Education } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface EditorSidebarProps {
    data: Partial<PortfolioData>;
    onChange: (data: Partial<PortfolioData>) => void;
    onOpenTemplateSelector: () => void;
}

type SectionId = 'template' | 'hero' | 'links' | 'about' | 'experience' | 'education' | 'skills';

interface SidebarSection {
    id: SectionId;
    icon: React.ReactNode;
    title: string;
    description: string;
    category: 'fixed' | 'movable';
}

const sections: SidebarSection[] = [
    { id: 'template', icon: <Palette className="w-4 h-4" />, title: 'Template', description: 'Customize the style of your profile', category: 'fixed' },
    { id: 'hero', icon: <User className="w-4 h-4" />, title: 'Hero section', description: 'Avatar, name and headline', category: 'fixed' },
    { id: 'links', icon: <Link2 className="w-4 h-4" />, title: 'Links', description: 'Highlight anything you like', category: 'fixed' },
    { id: 'about', icon: <FileText className="w-4 h-4" />, title: 'About', description: 'Summary of who you are', category: 'movable' },
    { id: 'experience', icon: <Briefcase className="w-4 h-4" />, title: 'Experience', description: 'Your work experience', category: 'movable' },
    { id: 'education', icon: <GraduationCap className="w-4 h-4" />, title: 'Education', description: 'Your educational background', category: 'movable' },
    { id: 'skills', icon: <Sparkles className="w-4 h-4" />, title: 'Skills', description: 'Your key skills', category: 'movable' },
];

const templateNames: Record<TemplateStyle, string> = {
    minimal: 'Minimal',
    modern: 'Modern',
    creative: 'Creative',
    bold: 'Bold',
    elegant: 'Elegant',
};

export default function EditorSidebar({ data, onChange, onOpenTemplateSelector }: EditorSidebarProps) {
    const [activeSection, setActiveSection] = useState<SectionId | null>(null);
    const [newSkill, setNewSkill] = useState('');

    const toggleSection = (id: SectionId) => {
        setActiveSection(activeSection === id ? null : id);
    };

    // Update functions
    const updatePersonal = (field: string, value: string) => {
        onChange({
            ...data,
            personal: { ...data.personal!, [field]: value }
        });
    };

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
    };

    const removeExperience = (id: string) => {
        onChange({
            ...data,
            experiences: data.experiences?.filter(exp => exp.id !== id)
        });
    };

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
    };

    const removeEducation = (id: string) => {
        onChange({
            ...data,
            education: data.education?.filter(edu => edu.id !== id)
        });
    };

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

    const renderSectionContent = (sectionId: SectionId) => {
        switch (sectionId) {
            case 'template':
                return (
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium">Current template</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {templateNames[data.templateStyle || 'modern']}
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={onOpenTemplateSelector}>
                                Change
                            </Button>
                        </div>
                    </div>
                );

            case 'hero':
                return (
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs">First Name</Label>
                                <Input
                                    value={data.personal?.firstName || ''}
                                    onChange={e => updatePersonal('firstName', e.target.value)}
                                    placeholder="John"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Last Name</Label>
                                <Input
                                    value={data.personal?.lastName || ''}
                                    onChange={e => updatePersonal('lastName', e.target.value)}
                                    placeholder="Doe"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs">Headline</Label>
                            <Input
                                value={data.personal?.headline || ''}
                                onChange={e => updatePersonal('headline', e.target.value)}
                                placeholder="Software Engineer"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Location</Label>
                            <Input
                                value={data.personal?.location || ''}
                                onChange={e => updatePersonal('location', e.target.value)}
                                placeholder="San Francisco, CA"
                                className="mt-1"
                            />
                        </div>
                    </div>
                );

            case 'links':
                return (
                    <div className="p-4 space-y-4">
                        <div>
                            <Label className="text-xs">Email</Label>
                            <Input
                                value={data.personal?.email || ''}
                                onChange={e => updatePersonal('email', e.target.value)}
                                placeholder="john@example.com"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Website</Label>
                            <Input
                                value={data.personal?.website || ''}
                                onChange={e => updatePersonal('website', e.target.value)}
                                placeholder="https://yoursite.com"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-xs">LinkedIn</Label>
                            <Input
                                value={data.personal?.linkedinUrl || ''}
                                onChange={e => updatePersonal('linkedinUrl', e.target.value)}
                                placeholder="https://linkedin.com/in/yourprofile"
                                className="mt-1"
                            />
                        </div>
                    </div>
                );

            case 'about':
                return (
                    <div className="p-4">
                        <Label className="text-xs">About / Summary</Label>
                        <Textarea
                            value={data.personal?.summary || ''}
                            onChange={e => updatePersonal('summary', e.target.value)}
                            placeholder="Tell your story..."
                            rows={5}
                            className="mt-1"
                        />
                    </div>
                );

            case 'experience':
                return (
                    <div className="p-4 space-y-3">
                        <Button variant="outline" size="sm" onClick={addExperience} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Experience
                        </Button>
                        {data.experiences?.map(exp => (
                            <div key={exp.id} className="border border-border rounded-lg p-3 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <Input
                                            value={exp.title}
                                            onChange={e => updateExperience(exp.id, 'title', e.target.value)}
                                            placeholder="Job Title"
                                            className="font-medium"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeExperience(exp.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Input
                                    value={exp.company}
                                    onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                                    placeholder="Company"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        value={exp.startDate}
                                        onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                                        placeholder="Start Date"
                                    />
                                    <Input
                                        value={exp.endDate || ''}
                                        onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                                        placeholder={exp.current ? 'Present' : 'End Date'}
                                        disabled={exp.current}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`current-${exp.id}`}
                                        checked={exp.current}
                                        onChange={e => updateExperience(exp.id, 'current', e.target.checked)}
                                        className="rounded"
                                    />
                                    <Label htmlFor={`current-${exp.id}`} className="text-xs font-normal cursor-pointer">
                                        Currently working here
                                    </Label>
                                </div>
                                <Textarea
                                    value={exp.description}
                                    onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                                    placeholder="Description..."
                                    rows={2}
                                />
                            </div>
                        ))}
                        {(!data.experiences || data.experiences.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No experience added yet.
                            </p>
                        )}
                    </div>
                );

            case 'education':
                return (
                    <div className="p-4 space-y-3">
                        <Button variant="outline" size="sm" onClick={addEducation} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Education
                        </Button>
                        {data.education?.map(edu => (
                            <div key={edu.id} className="border border-border rounded-lg p-3 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <Input
                                            value={edu.school}
                                            onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                                            placeholder="School / University"
                                            className="font-medium"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeEducation(edu.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        value={edu.degree}
                                        onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                                        placeholder="Degree"
                                    />
                                    <Input
                                        value={edu.field}
                                        onChange={e => updateEducation(edu.id, 'field', e.target.value)}
                                        placeholder="Field of Study"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        value={edu.startDate}
                                        onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                                        placeholder="Start Year"
                                    />
                                    <Input
                                        value={edu.endDate || ''}
                                        onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                                        placeholder="End Year"
                                    />
                                </div>
                            </div>
                        ))}
                        {(!data.education || data.education.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No education added yet.
                            </p>
                        )}
                    </div>
                );

            case 'skills':
                return (
                    <div className="p-4 space-y-3">
                        <div className="flex gap-2">
                            <Input
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                placeholder="Add a skill..."
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            />
                            <Button variant="outline" size="icon" onClick={addSkill}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="group flex items-center gap-1 px-2.5 py-1 bg-primary/10 rounded-full text-sm"
                                >
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(index)}
                                        className="w-4 h-4 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center opacity-60 hover:opacity-100"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        {(!data.skills || data.skills.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-2">
                                No skills added yet.
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const fixedSections = sections.filter(s => s.category === 'fixed');
    const movableSections = sections.filter(s => s.category === 'movable');

    return (
        <div className="h-full flex flex-col bg-background border-r border-border">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Edit profile</h2>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto">
                {/* Fixed sections */}
                <div className="p-2">
                    <p className="text-xs font-medium text-muted-foreground px-2 py-1">FIXED</p>
                    {fixedSections.map(section => (
                        <div key={section.id} className="mb-1">
                            <button
                                onClick={() => toggleSection(section.id)}
                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted/50 ${activeSection === section.id ? 'bg-muted' : ''
                                    }`}
                            >
                                <span className="text-muted-foreground">{section.icon}</span>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-medium truncate">{section.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">{section.description}</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === section.id ? 'rotate-90' : ''
                                    }`} />
                            </button>
                            {activeSection === section.id && (
                                <div className="bg-muted/30 rounded-lg mt-1 mb-2">
                                    {renderSectionContent(section.id)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Movable sections */}
                <div className="p-2 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground px-2 py-1">MOVABLE</p>
                    {movableSections.map(section => (
                        <div key={section.id} className="mb-1">
                            <button
                                onClick={() => toggleSection(section.id)}
                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted/50 ${activeSection === section.id ? 'bg-muted' : ''
                                    }`}
                            >
                                <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                                <span className="text-muted-foreground">{section.icon}</span>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-medium truncate">{section.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">{section.description}</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === section.id ? 'rotate-90' : ''
                                    }`} />
                            </button>
                            {activeSection === section.id && (
                                <div className="bg-muted/30 rounded-lg mt-1 mb-2">
                                    {renderSectionContent(section.id)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
