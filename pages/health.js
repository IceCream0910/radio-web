"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Radio,
    RefreshCw,
    Search,
} from "lucide-react";

export default function RadioHealthDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchHealth = async () => {
        try {
            const response = await fetch('/api/health', {
                cache: "no-store",
            });

            const json = await response.json();

            setData(json);
            setLastUpdated(json.refreshed_at ? new Date(json.refreshed_at) : new Date());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set("showUi", "0");
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, "", newUrl);
        fetchHealth();

        const interval = setInterval(() => {
            fetchHealth();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const stations = useMemo(() => {
        if (!data?.results) return [];

        return data.results
            .map(station => {
                let uiStatus = "unhealthy";
                if (station.ok) uiStatus = "healthy";
                else if (station.status === "never_checked") uiStatus = "stale";
                return { ...station, uiStatus };
            })
            .filter((station) =>
                station.title
                    .toLowerCase()
                    .includes(query.toLowerCase())
            )
            .sort((a, b) => {
                const priority = {
                    unhealthy: 0,
                    stale: 1,
                    healthy: 2,
                };

                return priority[a.uiStatus] - priority[b.uiStatus];
            });
    }, [data, query]);

    const summary = useMemo(() => {
        const counts = {
            healthy: 0,
            unhealthy: 0,
            stale: 0,
        };

        stations.forEach((station) => {
            counts[station.uiStatus]++;
        });

        return counts;
    }, [stations]);

    return (
        <div style={{ minHeight: '100vh', color: '#fff', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(24,24,27,0.5)', borderRadius: '1.5rem', padding: '1.5rem 0.5rem', border: '1px solid #27272a' }}>
                        <SummaryCard
                            title="온라인"
                            value={summary.healthy}
                            icon={<CheckCircle2 style={{ width: '1rem', height: '1rem' }} />}
                            color="#34d399"
                        />

                        <SummaryCard
                            title="오프라인"
                            value={summary.unhealthy}
                            icon={<AlertTriangle style={{ width: '1rem', height: '1rem' }} />}
                            color="#f87171"
                        />

                        <SummaryCard
                            title="체크 필요"
                            value={summary.stale}
                            icon={<Clock3 style={{ width: '1rem', height: '1rem' }} />}
                            color="#facc15"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', maxWidth: '28rem', width: '100%' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#71717a', zIndex: 99 }} />

                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="스테이션 검색"
                                style={{ boxSizing: 'border-box', width: '100%', borderRadius: '1rem', border: '1px solid #27272a', backgroundColor: 'rgba(24,24,27,0.8)', backdropFilter: 'blur(24px)', padding: '1rem 1rem 1rem 2.75rem', outline: 'none', transition: 'border-color 0.2s', color: 'white' }}
                            />
                        </div>

                        <div style={{ fontSize: '0.875rem', color: '#71717a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {data?.checking ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                                </motion.div>
                            ) : (
                                <Activity style={{ width: '1rem', height: '1rem' }} />
                            )}
                            {data?.checking ? "상태 확인 중..." : lastUpdated
                                ? `업데이트: ${lastUpdated.toLocaleTimeString()}`
                                : "Loading..."}
                        </div>
                    </div>
                </motion.div>

                <div style={{ marginTop: '2.5rem' }}>
                    <AnimatePresence>
                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                layout
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}
                            >
                                {stations.map((station, index) => (
                                    <StationCard
                                        key={station.title}
                                        station={station}
                                        index={index}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, color }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: color, marginBottom: '0.25rem', display: 'flex', justifyContent: 'center' }}>
                {icon}
            </div>
            <div style={{ marginTop: '0.1rem', fontSize: '2.5rem', fontWeight: 'bold' }}>
                {value}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#71717a' }}>
                {title}
            </div>
        </div>
    );
}

function StationCard({ station, index }) {
    const styles = {
        healthy: {
            badge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', borderColor: 'rgba(16, 185, 129, 0.2)' },
            dot: { backgroundColor: '#34d399' },
        },
        unhealthy: {
            badge: { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.2)' },
            dot: { backgroundColor: '#f87171' },
        },
        stale: {
            badge: { backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#fde047', borderColor: 'rgba(234, 179, 8, 0.2)' },
            dot: { backgroundColor: '#facc15' },
        },
    };

    const style = styles[station.uiStatus];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ y: -4 }}
            style={{ position: 'relative', overflow: 'hidden', borderRadius: '1.5rem', border: '1px solid #27272a', backgroundColor: 'rgba(24,24,27,0.7)', backdropFilter: 'blur(40px)', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom right, rgba(255,255,255,0.03), transparent)' }} />

            <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25, margin: 0 }}>
                            {station.title}
                        </h2>

                        <div
                            onClick={() => window.open(station.source_url, '_blank')}
                            style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#71717a', wordBreak: 'break-all', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>
                            {station.source_url}
                        </div>
                    </div>

                    <span
                        style={{ width: '1.5rem', aspectRatio: '1/1', borderRadius: '9999px', ...style.dot }}
                    />
                </div>

                {station.error && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {station.error}
                    </div>
                )}

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <div style={{ color: '#71717a' }}>상태 코드:</div>
                        <div style={{ color: '#d4d4d8' }}>{station.http_status ? `${station.http_status}` : '-'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <div style={{ color: '#71717a' }}>응답 시간:</div>
                        <div style={{ color: '#d4d4d8' }}>{station.elapsed_ms != null ? `${station.elapsed_ms}ms` : '-'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <div style={{ color: '#71717a' }}>마지막 확인:</div>
                        <div style={{ color: '#d4d4d8' }}>
                            {station.checked_at
                                ? new Date(station.checked_at).toLocaleString()
                                : "아직 확인되지 않음"}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <div style={{ borderRadius: '1.5rem', border: '1px solid #27272a', backgroundColor: 'rgba(24,24,27,0.7)', padding: '1.5rem', opacity: 0.7 }}>
            <div style={{ height: '1.5rem', width: '50%', borderRadius: '0.25rem', backgroundColor: '#27272a' }} />
            <div style={{ marginTop: '0.75rem', height: '1rem', width: '100%', borderRadius: '0.25rem', backgroundColor: '#27272a' }} />
            <div style={{ marginTop: '2rem', height: '1rem', width: '100%', borderRadius: '0.25rem', backgroundColor: '#27272a' }} />
            <div style={{ marginTop: '0.75rem', height: '1rem', width: '80%', borderRadius: '0.25rem', backgroundColor: '#27272a' }} />
            <div style={{ marginTop: '0.75rem', height: '1rem', width: '60%', borderRadius: '0.25rem', backgroundColor: '#27272a' }} />
        </div>
    );
}
