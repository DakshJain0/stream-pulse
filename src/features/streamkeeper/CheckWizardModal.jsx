import React, { useState } from 'react';

export function CheckWizardModal({ site, isOpen, onClose, onSubmitCheck }) {
  const [step, setStep] = useState(1);
  const [clarity, setClarity] = useState('Clear');
  const [flow, setFlow] = useState('Moderate');
  const [rating, setRating] = useState('Good');
  const [notes, setNotes] = useState('');

  if (!isOpen || !site) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitCheck(site.id, {
      lastRating: rating,
      clarity,
      flow,
      notes,
    });
    // Reset and close
    setStep(1);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          color: '#0f172a',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Field Observation Wizard
            </span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800' }}>
              Verify: {site.name}
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              🌊 {site.waterBody} • {site.city}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              color: '#94a3b8',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  1. Water Clarity:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['Clear', 'Slightly Turbid', 'Opaque/Murky'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setClarity(opt)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '8px',
                        border: clarity === opt ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: clarity === opt ? '#eff6ff' : '#ffffff',
                        color: clarity === opt ? '#1d4ed8' : '#334155',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  2. Stream Flow Condition:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['Normal Flow', 'High/Runoff', 'Stagnant/Dry'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFlow(opt)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '8px',
                        border: flow === opt ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: flow === opt ? '#eff6ff' : '#ffffff',
                        color: flow === opt ? '#1d4ed8' : '#334155',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Next: Biological Health →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                  3. Overall Ecological Rating:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { label: 'Good', desc: 'No odor, life observed' },
                    { label: 'Moderate', desc: 'Algae or cloudy' },
                    { label: 'Poor', desc: 'Strong odor / litter' },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setRating(opt.label)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '8px',
                        border: rating === opt.label ? '2px solid #10b981' : '1px solid #cbd5e1',
                        backgroundColor: rating === opt.label ? '#ecfdf5' : '#ffffff',
                        color: rating === opt.label ? '#065f46' : '#334155',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{opt.label}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Field Notes (Optional):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Water clear, observed small fish near weir..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ✓ Submit & Verify Stream
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}