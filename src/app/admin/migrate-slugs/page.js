'use client';

import { useState } from 'react';
import { migrateProductSlugs } from '@/lib/migrate-slugs';
import { ArrowLeft, Loader2, CheckCircle2, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function MigrateSlugsPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleMigrate = async () => {
    setRunning(true);
    setError(null);
    setResults(null);

    try {
      const res = await migrateProductSlugs();
      setResults(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen bg-[#F5F5F7]">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#86868b] hover:text-black transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Admin
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-black mb-2 flex items-center gap-3">
        <LinkIcon className="w-6 h-6 text-[#0071e3]" />
        Product Slug Migration
      </h1>
      <p className="text-sm text-[#86868b] mb-8">
        Generate clean URL slugs for all existing products. This adds a <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono">slug</code> field to each product document in Firestore.
      </p>

      {!results && !running && (
        <button
          onClick={handleMigrate}
          className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
        >
          Run Migration
        </button>
      )}

      {running && (
        <div className="flex items-center gap-3 text-sm text-[#86868b]">
          <Loader2 className="w-5 h-5 animate-spin" />
          Migrating products... This may take a moment.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Migration Error</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#d2d2d7]/50">
              <p className="text-2xl font-semibold text-black">{results.total}</p>
              <p className="text-xs text-[#86868b] uppercase tracking-wider">Total Products</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-green-200">
              <p className="text-2xl font-semibold text-green-600">{results.updated}</p>
              <p className="text-xs text-[#86868b] uppercase tracking-wider">Slugs Created</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#d2d2d7]/50">
              <p className="text-2xl font-semibold text-[#86868b]">{results.skipped}</p>
              <p className="text-xs text-[#86868b] uppercase tracking-wider">Already Had Slug</p>
            </div>
          </div>

          {/* Detail Table */}
          <div className="bg-white rounded-xl border border-[#d2d2d7]/50 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F5F7] border-b border-[#d2d2d7]/50">
                <tr>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#86868b] font-medium">Product</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#86868b] font-medium">Slug</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#86868b] font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2d2d7]/30">
                {results.slugMap.map((item, i) => (
                  <tr key={i} className="hover:bg-[#F5F5F7]/50">
                    <td className="px-4 py-3 text-black font-medium">{item.name}</td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-[#F5F5F7] px-2 py-1 rounded font-mono text-[#0071e3]">
                        /product/{item.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      {item.status === 'created' ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Created
                        </span>
                      ) : (
                        <span className="text-xs text-[#86868b]">Skipped</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {results.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-800 mb-2">Errors ({results.errors.length})</p>
              {results.errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600">{err.name}: {err.error}</p>
              ))}
            </div>
          )}

          <button
            onClick={handleMigrate}
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
          >
            Run Again
          </button>
        </div>
      )}
    </div>
  );
}
