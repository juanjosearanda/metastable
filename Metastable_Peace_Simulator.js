import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Activity, TrendingUp, AlertTriangle, Eye, Link, RefreshCcw, Scale } from 'lucide-react';

export default function App() {
  // Model State Variables (0 to 100)
  const [entropy, setEntropy] = useState(80); // Starts high (dangerous)
  const [coupling, setCoupling] = useState(20); // Starts low (dangerous)
  const [signaling, setSignaling] = useState(10); // Jervis Safety signaling
  const [parityImbalance, setParityImbalance] = useState(60); // Third player alignment (0 = perfect balance)

  // Computed Payoffs
  const [payoffSQ, setPayoffSQ] = useState(0);
  const [payoffEscalation, setPayoffEscalation] = useState(0);

  // Computed Safeties
  const [kahnSafety, setKahnSafety] = useState(0);
  const [schellingSafety, setSchellingSafety] = useState(0);
  const [jervisSafety, setJervisSafety] = useState(0);

  // System State
  const [systemState, setSystemState] = useState({ name: 'Calculating...', color: 'bg-gray-500', rungs: '' });

  // Mathematical Model Simulation
  useEffect(() => {
    // Base Constants
    const BASE_SQ = 40;
    const BASE_ESC = 65;

    // 1. Calculate Payoffs based on the mathematical framework
    const calculatedSQ = BASE_SQ + (coupling * 0.4) + (signaling * 0.2) - (entropy * 0.3);
    const calculatedEscalation = BASE_ESC - (coupling * 0.6) + (entropy * 0.4) + (parityImbalance * 0.3);

    setPayoffSQ(Math.max(0, calculatedSQ));
    setPayoffEscalation(Math.max(0, calculatedEscalation));

    // 2. Calculate Safety Indices
    // Kahn Safety: Inversely related to escalation payoff (how thoroughly is first strike denied?)
    setKahnSafety(Math.min(100, Math.max(0, 120 - calculatedEscalation)));
    
    // Schelling Safety: Driven by coupling (interdependence) and low entropy (focal points)
    setSchellingSafety(Math.min(100, Math.max(0, (coupling * 0.6) + ((100 - entropy) * 0.4))));
    
    // Jervis Safety: Driven by aggressive de-escalation signaling and low entropy
    setJervisSafety(Math.min(100, Math.max(0, (signaling * 0.6) + ((100 - entropy) * 0.4))));

    // 3. Determine System State (The Inverted Pendulum)
    const diff = calculatedSQ - calculatedEscalation;

    if (diff >= 15) {
      setSystemState({ 
        name: 'Metastable Peace', 
        color: 'bg-emerald-500', text: 'text-emerald-500',
        rungs: 'Status Quo Maintained',
        desc: 'The inverted pendulum is balanced. Payoff for peace vastly outweighs escalation.'
      });
    } else if (diff >= 0 && diff < 15) {
      setSystemState({ 
        name: 'Tense Parity', 
        color: 'bg-yellow-500', text: 'text-yellow-500',
        rungs: 'Rungs 1-2: Gestures',
        desc: 'System is volatile. Minor misperceptions could trigger an escalation spiral.'
      });
    } else if (diff < 0 && diff > -20) {
      setSystemState({ 
        name: 'Escalation Spiral', 
        color: 'bg-orange-500', text: 'text-orange-500',
        rungs: 'Rungs 4-9: Traditional Crisis',
        desc: 'Coupling is too low or Entropy too high. Actors are seeking Escalation Dominance.'
      });
    } else {
      setSystemState({ 
        name: 'Kahn-Style Spasm War', 
        color: 'bg-red-600', text: 'text-red-600',
        rungs: 'Rungs 10+: Threshold of No Return',
        desc: 'First Strike Stability achieved by one actor. Total system collapse.'
      });
    }
  }, [entropy, coupling, signaling, parityImbalance]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-blue-500" size={32} />
            Metastable Peace Dynamics Simulator
          </h1>
          <p className="text-slate-400 mt-2">
            Adjust the control variables to keep Information Entropy low and Coupling high. 
            The goal is to force the <span className="text-blue-400 font-semibold">Perceived Payoff</span> to remain higher than the <span className="text-red-400 font-semibold">Maximum Potential Payoff</span> of escalation.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Control Variables */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-slate-400"/>
                System Inputs
              </h2>

              {/* Entropy Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Eye size={16} className="text-purple-400"/>
                    Information Entropy
                  </label>
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{entropy}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={entropy} 
                  onChange={(e) => setEntropy(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-slate-500 leading-tight">Lower is better. High entropy causes Jervis-style misperception and arms racing.</p>
              </div>

              {/* Coupling Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Link size={16} className="text-emerald-400"/>
                    System Coupling
                  </label>
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{coupling}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={coupling} 
                  onChange={(e) => setCoupling(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-slate-500 leading-tight">Higher is better. High coupling ensures everyone's survival depends on system integrity.</p>
              </div>

              {/* De-escalation Signaling Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <RefreshCcw size={16} className="text-blue-400"/>
                    De-escalation Signaling
                  </label>
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{signaling}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={signaling} 
                  onChange={(e) => setSignaling(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-slate-500 leading-tight">Aggressive signaling ensures defensive moves aren't seen as existential threats.</p>
              </div>

              {/* Third Player Balancing Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Scale size={16} className="text-amber-400"/>
                    Parity Imbalance (3rd Player)
                  </label>
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{parityImbalance}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={parityImbalance} 
                  onChange={(e) => setParityImbalance(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-slate-500 leading-tight">Lower is better. 0% means the 3rd player perfectly balances the giants ("Stagnant Parity").</p>
              </div>

            </div>
          </div>

          {/* Right Column: Visualizations & Readouts */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Row: System State & Payoff Bar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* System State Monitor */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${systemState.color}`}></div>
                <div className="mb-2">
                  {payoffSQ >= payoffEscalation ? 
                    <ShieldCheck size={48} className={systemState.text} /> : 
                    <AlertTriangle size={48} className={systemState.text} />
                  }
                </div>
                <h3 className={`text-2xl font-bold ${systemState.text} mb-1`}>{systemState.name}</h3>
                <span className="text-sm font-mono bg-slate-950 px-3 py-1 rounded-full text-slate-400 mb-3 border border-slate-800">
                  {systemState.rungs}
                </span>
                <p className="text-sm text-slate-400">{systemState.desc}</p>
              </div>

              {/* Payoff Comparison Chart */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-center">Utility Payoff Matrix</h3>
                <div className="flex items-end justify-center gap-8 h-40 mt-4 relative">
                  
                  {/* Status Quo Bar */}
                  <div className="flex flex-col items-center w-24">
                    <span className="text-lg font-bold text-blue-400 mb-2">{payoffSQ.toFixed(1)}</span>
                    <div className="w-full bg-slate-800 rounded-t-md flex items-end justify-center h-full relative">
                      <div 
                        className="w-full bg-blue-500 rounded-t-md transition-all duration-500 ease-out"
                        style={{ height: `${Math.min(100, (payoffSQ / 150) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="mt-2 text-sm font-medium text-slate-300 text-center leading-tight">Perceived Payoff<br/>(Status Quo)</span>
                  </div>

                  {/* Escalation Bar */}
                  <div className="flex flex-col items-center w-24">
                    <span className="text-lg font-bold text-red-400 mb-2">{payoffEscalation.toFixed(1)}</span>
                    <div className="w-full bg-slate-800 rounded-t-md flex items-end justify-center h-full relative">
                      <div 
                        className="w-full bg-red-500 rounded-t-md transition-all duration-500 ease-out"
                        style={{ height: `${Math.min(100, (payoffEscalation / 150) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="mt-2 text-sm font-medium text-slate-300 text-center leading-tight">Max Potential Payoff<br/>(Escalation)</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Row: The Three Safeties */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShieldAlert size={20} className="text-slate-400" />
                The Triad of Active Stabilizing Feedback
              </h3>
              
              <div className="space-y-5">
                {/* Kahn Safety */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <span className="font-semibold text-slate-200">Kahn Safety </span>
                      <span className="text-xs text-slate-500 ml-2">(No First Strike Stability)</span>
                    </div>
                    <span className="text-sm font-mono text-slate-400">{kahnSafety.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-red-600 to-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${kahnSafety}%` }}></div>
                  </div>
                </div>

                {/* Schelling Safety */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <span className="font-semibold text-slate-200">Schelling Safety </span>
                      <span className="text-xs text-slate-500 ml-2">(Focal Points / No Burned Bridges)</span>
                    </div>
                    <span className="text-sm font-mono text-slate-400">{schellingSafety.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-orange-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${schellingSafety}%` }}></div>
                  </div>
                </div>

                {/* Jervis Safety */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <span className="font-semibold text-slate-200">Jervis Safety </span>
                      <span className="text-xs text-slate-500 ml-2">(De-escalation / Misperception Control)</span>
                    </div>
                    <span className="text-sm font-mono text-slate-400">{jervisSafety.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-yellow-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${jervisSafety}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

