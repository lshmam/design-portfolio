import { v4 as uuidv4 } from 'uuid';
import type { PortfolioData, TemplateStyle, HostingOption } from './types';

// In-memory store (in production, use a database)
const portfolios: Map<string, PortfolioData> = new Map();

export function createPortfolio(data: Partial<PortfolioData>): PortfolioData {
    const now = new Date().toISOString();
    const portfolio: PortfolioData = {
        id: uuidv4(),
        personal: data.personal || {
            firstName: '',
            lastName: '',
            headline: '',
            summary: '',
            location: '',
            email: ''
        },
        experiences: data.experiences || [],
        education: data.education || [],
        skills: data.skills || [],
        projects: data.projects || [],
        templateStyle: data.templateStyle || 'modern',
        hostingOption: data.hostingOption || 'hosted',
        customDomain: data.customDomain,
        colorAccent: data.colorAccent || '#6366f1',
        isPaid: false,
        createdAt: now,
        updatedAt: now
    };

    portfolios.set(portfolio.id, portfolio);
    return portfolio;
}

export function getPortfolio(id: string): PortfolioData | undefined {
    return portfolios.get(id);
}

export function updatePortfolio(id: string, updates: Partial<PortfolioData>): PortfolioData | undefined {
    const existing = portfolios.get(id);
    if (!existing) return undefined;

    const updated: PortfolioData = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
    };

    portfolios.set(id, updated);
    return updated;
}

export function markPortfolioAsPaid(id: string): boolean {
    const portfolio = portfolios.get(id);
    if (!portfolio) return false;

    portfolio.isPaid = true;
    portfolio.updatedAt = new Date().toISOString();
    portfolios.set(id, portfolio);
    return true;
}

export function deletePortfolio(id: string): boolean {
    return portfolios.delete(id);
}

export function getAllPortfolios(): PortfolioData[] {
    return Array.from(portfolios.values());
}

// Generate a slug from the portfolio owner's name
export function generateSlug(portfolio: PortfolioData): string {
    const name = `${portfolio.personal.firstName}-${portfolio.personal.lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    return name || portfolio.id.slice(0, 8);
}
