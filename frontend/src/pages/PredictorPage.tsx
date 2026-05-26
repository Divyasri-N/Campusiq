import React, { useState } from 'react';
import { COLLEGES, EXAM_OPTIONS } from '../data/colleges';
import type { Category, PredictorResult } from '../types';
import { CollegeLogo, Badge, EmptyState } from '../components/ui';
import { formatMoney, formatFees } from '../utils/format';

type ChanceLevel = 'High' | 'Medium' | 'Low';

const CHANCE_STYLES: Record<
  ChanceLevel,
  { bg: string; text: string; border: string }
> = {
  High:   { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  Medium: { bg: '#fef3c7', text: '#78350f', border: '#fcd34d' },
  Low:    { bg: '#fee2e2', text: '#7f1d1d', border: '#fca5a5' },
};

const CATEGORIES: Category[] = ['General', 'OBC', 'SC', 'ST', 'EWS'];

// ─── Rank-based prediction logic ─────────────────────────────────────────────
function predictColleges(
  examName: string,
  rank: number,
  _category: Category
): PredictorResult[] {
  const examData = EXAM_OPTIONS.find((e) => e.name === examName);
  const isPercentile = examName === 'CAT' || examName === 'CUET';

  const eligible = COLLEGES.filter(
    (c) =>
      c.intake === examName ||
      (examData?.types as readonly string[]).includes(c.type)
  );

  const results: PredictorResult[] = eligible
    .map((c) => {
      let chance: ChanceLevel | null = null;

      if (isPercentile) {
        // Higher percentile = better
        if (rank >= c.cutoff + 2)      chance = 'High';
        else if (rank >= c.cutoff)     chance = 'Medium';
        else if (rank >= c.cutoff - 3) chance = 'Low';
      } else {
        // Lower rank = better
        if (rank <= c.cutoff * 0.8)  chance = 'High';
        else if (rank <= c.cutoff)   chance = 'Medium';
        else if (rank <= c.cutoff * 1.5) chance = 'Low';
      }

      return chance ? { college: c, chance } : null;
    })
    .filter((x): x is PredictorResult => x !== null)
    .sort((a, b) => {
      const order: Record<ChanceLevel, number> = { High: 0, Medium: 1, Low: 2 };
      return (
        order[a.chance] - order[b.chance] ||
        b.college.rating - a.college.rating
      );
    });

  return results;
}

// ─── Claude Streaming Insight ─────────────────────────────────────────────────
async function streamInsight(
  exam: string,
  rank: number,
  category: Category,
  results: PredictorResult[],
  onChunk: (text: string) => void,
  onDone: () => void
): Promise<void> {
  const topMatches = results
    .slice(0, 3)
    .map((r) => `${r.college.name} (${r.chance} chance)`)
    .join(', ');

  const prompt = `You are a college admissions counselor in India. A student scored rank/score ${rank} in ${exam} (${category} category). They have ${results.length} predicted college options. Top matches: ${topMatches}.

Give a concise, specific, actionable 3-4 sentence insight: what this rank/score means for their prospects, which tier they can realistically target, and 1-2 specific tips. Be encouraging but realistic. Do not use markdown formatting.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        stream: true,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (
            parsed.type === 'content_block_delta' &&
            parsed.delta?.text
          ) {
            onChunk(parsed.delta.text);
          }
        } catch {
          // ignore malformed SSE
        }
      }
    }
  } catch {
    onChunk(
      'Predictions based on historical cutoff data. Actual results may vary depending on category, year, and seat availability.'
    );
  } finally {
    onDone();
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const PredictorPage: React.FC = () => {
  const [exam, setExam] = useState<string>('JEE Advanced');
  const [rank, setRank] = useState<string>('');
  const [category, setCategory] = useState<Category>('General');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PredictorResult[] | null>(null);
  const [aiInsight, setAiInsight] = useState('');
  const [streaming, setStreaming] = useState(false);

  const isPercentile = exam === 'CAT' || exam === 'CUET';
  const canPredict = rank.trim() !== '' && !loading;

  const handlePredict = async () => {
    if (!canPredict) return;
    setLoading(true);
    setResults(null);
    setAiInsight('');

    // Simulate API latency
    await new Promise((r) => setTimeout(r, 500));

    const predicted = predictColleges(exam, parseFloat(rank), category);
    setResults(predicted);
    setLoading(false);

    if (predicted.length > 0) {
      setStreaming(true);
      await streamInsight(
        exam,
        parseFloat(rank),
        category,
        predicted,
        (chunk) => setAiInsight((prev) => prev + chunk),
        () => setStreaming(false)
      );
    }
  };

  const chanceCount = (level: ChanceLevel) =>
    (results ?? []).filter((r) => r.chance === level).length;

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          borderRadius: 16,
          padding: '32px 28px',
          marginBottom: 24,
          color: '#fff',
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#60a5fa',
            letterSpacing: 1.2,
            marginBottom: 8,
          }}
        >
          AI-POWERED
        </div>
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 26,
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
          }}
        >
          College Predictor
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>
          Enter your exam details to get personalized college recommendations and
          AI counselor insights
        </p>
      </div>

      {/* Input Form */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Exam */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6b7280',
                display: 'block',
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              ENTRANCE EXAM
            </label>
            <select
              value={exam}
              onChange={(e) => {
                setExam(e.target.value);
                setResults(null);
                setAiInsight('');
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1.5px solid #d1d5db',
                fontSize: 14,
                color: '#111827',
                fontFamily: 'inherit',
              }}
            >
              {EXAM_OPTIONS.map((e) => (
                <option key={e.name} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rank / Percentile */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6b7280',
                display: 'block',
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              {isPercentile ? 'PERCENTILE / SCORE' : 'YOUR RANK'}
            </label>
            <input
              type="number"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder={isPercentile ? 'e.g. 99.5' : 'e.g. 1500'}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1.5px solid #d1d5db',
                fontSize: 14,
                color: '#111827',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6b7280',
                display: 'block',
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1.5px solid #d1d5db',
                fontSize: 14,
                color: '#111827',
                fontFamily: 'inherit',
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={!canPredict}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 10,
            border: 'none',
            background: canPredict ? '#3b82f6' : '#e5e7eb',
            color: canPredict ? '#fff' : '#9ca3af',
            fontWeight: 700,
            fontSize: 15,
            cursor: canPredict ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Analyzing…' : '🎯 Predict My Colleges'}
        </button>
      </div>

      {/* Results */}
      {results !== null && (
        <div>
          {/* AI Insight banner */}
          {(aiInsight || streaming) && (
            <div
              style={{
                background: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: 14,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🤖</span>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#1d4ed8',
                      letterSpacing: 0.8,
                      marginBottom: 6,
                    }}
                  >
                    AI COUNSELOR INSIGHT
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: '#1e40af',
                      lineHeight: 1.7,
                    }}
                  >
                    {aiInsight}
                    {streaming && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          animation: 'blink 1s infinite',
                        }}
                      >
                        ▊
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chance summary pills */}
          {results.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 16,
                flexWrap: 'wrap',
              }}
            >
              {(['High', 'Medium', 'Low'] as ChanceLevel[]).map((level) => {
                const count = chanceCount(level);
                if (count === 0) return null;
                const s = CHANCE_STYLES[level];
                return (
                  <div
                    key={level}
                    style={{
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      borderRadius: 10,
                      padding: '8px 16px',
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.text }}>
                      {level} Chance: {count} college{count > 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* No results */}
          {results.length === 0 && (
            <EmptyState
              emoji="😔"
              title="No matching colleges found"
              subtitle="Try a different rank, exam, or consider other entrance options"
            />
          )}

          {/* Result cards */}
          {results.map(({ college, chance }) => {
            const s = CHANCE_STYLES[chance];
            return (
              <div
                key={college.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 14,
                  padding: '18px 20px',
                  marginBottom: 12,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <CollegeLogo college={college} size={48} />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      marginBottom: 6,
                      flexWrap: 'wrap',
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>
                      {college.name}
                    </h3>
                    <span
                      style={{
                        background: s.bg,
                        color: s.text,
                        border: `1px solid ${s.border}`,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 10px',
                        borderRadius: 20,
                      }}
                    >
                      {chance} Chance
                    </span>
                    <Badge color={college.tier === 'Tier 1' ? 'blue' : 'amber'}>
                      {college.tier}
                    </Badge>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                    📍 {college.city} &nbsp;·&nbsp; ⭐ {college.rating} &nbsp;·&nbsp;
                    💰 {formatMoney(college.placements.avg)} avg &nbsp;·&nbsp;
                    🏦 {formatFees(college.fees)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
};

export default PredictorPage;