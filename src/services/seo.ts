interface PageMetrics {
  title: string;
  description: string;
  headers: {
    h1: number;
    h2: number;
    h3: number;
  };
  keywords: Array<{
    word: string;
    density: number;
  }>;
  performance: {
    score: number;
    loadTime: string;
    mobileScore: number;
    security: string;
  };
  recommendations: Array<{
    category: string;
    issue: string;
    impact: 'high' | 'medium' | 'low';
    suggestion: string;
  }>;
  scores: {
    title: number;
    description: number;
    headers: number;
    keywords: number;
  };
}

export const analyzePage = async (url: string): Promise<PageMetrics> => {
  try {
    const validUrl = new URL(url);
    if (!validUrl.protocol.startsWith('http')) {
      throw new Error('Please enter a valid HTTP or HTTPS URL');
    }

    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    
    if (!html) {
      throw new Error('No content received from the page');
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc.body) {
      throw new Error('Invalid HTML content received');
    }

    // Extract meta data with fallbacks
    const title = doc.title || doc.querySelector('h1')?.textContent || 'No title found';
    const metaDescription = 
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      'No description found';
    
    // Header analysis
    const h1Elements = doc.getElementsByTagName('h1');
    const h2Elements = doc.getElementsByTagName('h2');
    const h3Elements = doc.getElementsByTagName('h3');
    const h1Count = h1Elements.length;
    const h2Count = h2Elements.length;
    const h3Count = h3Elements.length;

    // Content analysis
    const textContent = doc.body.textContent || '';
    const words = textContent.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['this', 'that', 'with', 'from', 'have', 'were', 'what', 'when', 'your', 'will', 'about', 'they', 'their'].includes(word));
    
    const wordCount = words.length || 1;
    const wordFrequency: Record<string, number> = {};
    
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    const keywords = Object.entries(wordFrequency)
      .map(([word, count]) => ({
        word,
        density: (count / wordCount) * 100
      }))
      .sort((a, b) => b.density - a.density)
      .slice(0, 5);

    // Performance metrics
    const contentSize = html.length;
    const hasViewport = !!doc.querySelector('meta[name="viewport"]');
    const hasHttps = url.startsWith('https');
    const hasCaching = !!response.headers.get('cache-control');
    const hasCanonical = !!doc.querySelector('link[rel="canonical"]');
    const hasStructuredData = html.includes('application/ld+json');
    const hasOpenGraph = !!doc.querySelector('meta[property^="og:"]');
    const hasTwitterCards = !!doc.querySelector('meta[name^="twitter:"]');

    // Calculate scores
    const titleScore = calculateTitleScore(title);
    const descriptionScore = calculateDescriptionScore(metaDescription);
    const headerScore = calculateHeaderScore(h1Count, h2Count, h3Count);
    const keywordScore = calculateKeywordScore(keywords);
    const performanceScore = calculatePerformanceScore({
      contentSize,
      hasViewport,
      hasHttps,
      hasCaching,
      hasCanonical,
      hasStructuredData,
      hasOpenGraph,
      hasTwitterCards
    });

    // Generate recommendations
    const recommendations = generateRecommendations({
      title,
      description: metaDescription,
      h1Count,
      h2Count,
      h3Count,
      keywords,
      hasCanonical,
      hasStructuredData,
      hasOpenGraph,
      hasTwitterCards,
      hasViewport,
      hasHttps,
      contentSize
    });

    return {
      title,
      description: metaDescription,
      headers: {
        h1: h1Count,
        h2: h2Count,
        h3: h3Count
      },
      keywords: keywords.length ? keywords : [{ word: 'No keywords found', density: 0 }],
      performance: {
        score: performanceScore.overall,
        loadTime: `${(contentSize / 1024 / 1024).toFixed(2)}MB`,
        mobileScore: performanceScore.mobile,
        security: performanceScore.security
      },
      recommendations,
      scores: {
        title: titleScore,
        description: descriptionScore,
        headers: headerScore,
        keywords: keywordScore
      }
    };
  } catch (error) {
    console.error('Error analyzing page:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to analyze page. Please check the URL and try again.'
    );
  }
};

interface PerformanceMetrics {
  contentSize: number;
  hasViewport: boolean;
  hasHttps: boolean;
  hasCaching: boolean;
  hasCanonical: boolean;
  hasStructuredData: boolean;
  hasOpenGraph: boolean;
  hasTwitterCards: boolean;
}

interface PerformanceScores {
  overall: number;
  mobile: number;
  security: string;
}

function calculateTitleScore(title: string): number {
  let score = 100;
  
  if (!title) return 0;
  if (title.length < 30) score -= 30;
  if (title.length > 60) score -= 20;
  if (title.length > 70) score -= 20;
  if (!/[a-zA-Z0-9]/.test(title)) score -= 10;
  if (title.toLowerCase() === title) score -= 5;
  if (title.toUpperCase() === title) score -= 10;
  
  return Math.max(0, score);
}

function calculateDescriptionScore(description: string): number {
  let score = 100;
  
  if (!description) return 0;
  if (description.length < 120) score -= 30;
  if (description.length > 160) score -= 20;
  if (!/[a-zA-Z0-9]/.test(description)) score -= 10;
  if (!description.includes(' ')) score -= 20;
  if (description.toLowerCase() === description) score -= 5;
  
  return Math.max(0, score);
}

function calculateHeaderScore(h1: number, h2: number, h3: number): number {
  let score = 100;
  
  if (h1 === 0) score -= 40;
  if (h1 > 1) score -= 20;
  if (h2 === 0) score -= 10;
  if (h2 > 10) score -= 10;
  if (h3 === 0) score -= 5;
  if (h3 > 15) score -= 5;
  
  return Math.max(0, score);
}

function calculateKeywordScore(keywords: Array<{ word: string; density: number }>): number {
  let score = 100;
  
  if (keywords.length === 0) score -= 50;
  
  keywords.forEach(({ density }) => {
    if (density > 5) score -= 20;
    if (density < 0.5) score -= 10;
  });
  
  return Math.max(0, score);
}

function calculatePerformanceScore(metrics: PerformanceMetrics): PerformanceScores {
  let overall = 100;
  let mobile = 100;

  // Content size impact
  if (metrics.contentSize > 5242880) {
    overall -= 30;
    mobile -= 40;
  } else if (metrics.contentSize > 2097152) {
    overall -= 15;
    mobile -= 20;
  } else if (metrics.contentSize > 1048576) {
    overall -= 5;
    mobile -= 10;
  }

  // Mobile optimization
  if (!metrics.hasViewport) {
    mobile -= 50;
    overall -= 20;
  }

  // SEO optimization factors
  if (!metrics.hasCanonical) overall -= 10;
  if (!metrics.hasStructuredData) overall -= 15;
  if (!metrics.hasOpenGraph) overall -= 10;
  if (!metrics.hasTwitterCards) overall -= 5;

  // Security and optimization
  if (metrics.hasHttps) {
    overall += 10;
    mobile += 5;
  }

  if (metrics.hasCaching) {
    overall += 5;
    mobile += 5;
  }

  overall = Math.max(0, Math.min(100, overall));
  mobile = Math.max(0, Math.min(100, mobile));

  let security = 'C';
  if (metrics.hasHttps && metrics.hasCaching) {
    security = 'A+';
  } else if (metrics.hasHttps) {
    security = 'A';
  } else if (metrics.hasCaching) {
    security = 'B';
  }

  return {
    overall: Math.round(overall),
    mobile: Math.round(mobile),
    security
  };
}

interface RecommendationParams {
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  keywords: Array<{ word: string; density: number }>;
  hasCanonical: boolean;
  hasStructuredData: boolean;
  hasOpenGraph: boolean;
  hasTwitterCards: boolean;
  hasViewport: boolean;
  hasHttps: boolean;
  contentSize: number;
}

function generateRecommendations(params: RecommendationParams) {
  const recommendations: PageMetrics['recommendations'] = [];

  // Title recommendations
  if (!params.title) {
    recommendations.push({
      category: 'Title',
      issue: 'Missing page title',
      impact: 'high',
      suggestion: 'Add a descriptive page title between 30-60 characters.'
    });
  } else if (params.title.length < 30) {
    recommendations.push({
      category: 'Title',
      issue: 'Title too short',
      impact: 'medium',
      suggestion: 'Expand the title to be more descriptive (30-60 characters).'
    });
  } else if (params.title.length > 60) {
    recommendations.push({
      category: 'Title',
      issue: 'Title too long',
      impact: 'medium',
      suggestion: 'Shorten the title to ensure it displays properly in search results (30-60 characters).'
    });
  }

  // Meta description recommendations
  if (!params.description) {
    recommendations.push({
      category: 'Meta Description',
      issue: 'Missing meta description',
      impact: 'high',
      suggestion: 'Add a compelling meta description between 120-160 characters.'
    });
  } else if (params.description.length < 120) {
    recommendations.push({
      category: 'Meta Description',
      issue: 'Description too short',
      impact: 'medium',
      suggestion: 'Expand the meta description to be more informative (120-160 characters).'
    });
  } else if (params.description.length > 160) {
    recommendations.push({
      category: 'Meta Description',
      issue: 'Description too long',
      impact: 'medium',
      suggestion: 'Shorten the meta description to prevent truncation in search results (120-160 characters).'
    });
  }

  // Header structure recommendations
  if (params.h1Count === 0) {
    recommendations.push({
      category: 'Headers',
      issue: 'Missing H1 tag',
      impact: 'high',
      suggestion: 'Add a single H1 tag containing your main page heading.'
    });
  } else if (params.h1Count > 1) {
    recommendations.push({
      category: 'Headers',
      issue: 'Multiple H1 tags',
      impact: 'medium',
      suggestion: 'Use only one H1 tag per page for better SEO structure.'
    });
  }

  // Keyword recommendations
  params.keywords.forEach(({ word, density }) => {
    if (density > 5) {
      recommendations.push({
        category: 'Keywords',
        issue: `Keyword "${word}" appears too frequently`,
        impact: 'medium',
        suggestion: 'Reduce keyword density to avoid over-optimization. Aim for 1-3%.'
      });
    }
  });

  // Technical SEO recommendations
  if (!params.hasCanonical) {
    recommendations.push({
      category: 'Technical SEO',
      issue: 'Missing canonical tag',
      impact: 'medium',
      suggestion: 'Add a canonical tag to prevent duplicate content issues.'
    });
  }

  if (!params.hasStructuredData) {
    recommendations.push({
      category: 'Technical SEO',
      issue: 'No structured data',
      impact: 'medium',
      suggestion: 'Implement schema markup to enhance search result appearance.'
    });
  }

  if (!params.hasOpenGraph) {
    recommendations.push({
      category: 'Social Media',
      issue: 'Missing OpenGraph tags',
      impact: 'low',
      suggestion: 'Add OpenGraph meta tags for better social media sharing.'
    });
  }

  if (!params.hasViewport) {
    recommendations.push({
      category: 'Mobile Optimization',
      issue: 'Missing viewport meta tag',
      impact: 'high',
      suggestion: 'Add a viewport meta tag for proper mobile rendering.'
    });
  }

  if (!params.hasHttps) {
    recommendations.push({
      category: 'Security',
      issue: 'Not using HTTPS',
      impact: 'high',
      suggestion: 'Switch to HTTPS to improve security and SEO ranking.'
    });
  }

  if (params.contentSize > 5242880) {
    recommendations.push({
      category: 'Performance',
      issue: 'Large page size',
      impact: 'high',
      suggestion: 'Optimize images and minify resources to reduce page size below 5MB.'
    });
  }

  return recommendations;
}