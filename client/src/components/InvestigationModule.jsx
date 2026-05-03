import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Laptop, 
  Globe, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  UserX, 
  ExternalLink,
  KeyRound,
  ShieldCheck,
  Mail,
  Link,
  Search,
  Trash2,
  AlertTriangle,
  Fingerprint,
  Target,
  ShieldX,
  Navigation,
  FileSearch
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

const InvestigationModule = ({ alert, onClose }) => {
  const { setBlacklist, blacklist } = useSocket();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [findings, setFindings] = useState([]);
  const [isEscalated, setIsEscalated] = useState(false);
  const [remediations, setRemediations] = useState({
    passwordReset: false,
    sessionRevoked: false,
    blockDomain: false,
    blockHash: false,
    purgeMailbox: false,
    banIP: false
  });

  const isPhishing = alert.type?.includes('PHISHING');
  const scenario = alert.metadata || {};
  
  const accountCompromiseSteps = [
    { 
      id: 'location', 
      title: 'IP & Location Validation', 
      icon: <MapPin size={20} />,
      description: 'Validate if the current IP/Location is unusual for this user.'
    },
    { 
      id: 'travel', 
      title: 'Impossible Travel Analysis', 
      icon: <Navigation size={20} />,
      description: 'Calculate distance and time between last and current login.'
    },
    { 
      id: 'device', 
      title: 'Device & User Agent', 
      icon: <Laptop size={20} />,
      description: 'Check for browser/device fingerprint inconsistencies.'
    },
    { 
      id: 'activity', 
      title: 'Post-Login Activity', 
      icon: <FileSearch size={20} />,
      description: 'Review actions performed immediately after successful login.'
    },
    { 
      id: 'mfa', 
      title: 'MFA Verification', 
      icon: <ShieldCheck size={20} />,
      description: 'Determine if MFA was used, bypassed, or not configured.'
    }
  ];

  const phishingSteps = [
    {
      id: 'headers',
      title: 'Email Header Analysis',
      icon: <Mail size={20} />,
      description: 'Analyze SPF, DKIM, and DMARC status to identify spoofing.'
    },
    {
      id: 'sender',
      title: 'Sender Inspection',
      icon: <Fingerprint size={20} />,
      description: 'Check for lookalike domains and return-path mismatches.'
    },
    {
      id: 'links',
      title: 'Link Analysis',
      icon: <Link size={20} />,
      description: 'Verify URL destination vs display text and check for shorteners.'
    },
    {
      id: 'sandbox',
      title: 'Sandbox Analysis',
      icon: <ShieldCheck size={20} />,
      description: 'Execute attachments in an isolated environment to check for malware.'
    },
    {
      id: 'blast_radius',
      title: 'Blast Radius Search',
      icon: <Search size={20} />,
      description: 'Identify if other users in the organization received the same email.'
    }
  ];

  const steps = isPhishing ? phishingSteps : accountCompromiseSteps;

  const handleCompleteStep = (stepId, finding) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      setFindings([...findings, { stepId, finding }]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const calculateTravel = () => {
    // Simulated calculation
    return {
      distance: "11,000 km",
      timeDelta: "2 hours",
      velocity: "5,500 km/h",
      isImpossible: true
    };
  };

  const handleRemediation = (type) => {
    setRemediations(prev => ({ ...prev, [type] : true }));
    
    if (type === 'banIP') {
      setBlacklist(prev => [...new Set([alert.sourceIP, ...prev])]);
    }

    const labelMap = {
      passwordReset: 'Password Reset Forced',
      sessionRevoked: 'Session Revoked',
      blockDomain: 'Domain Blacklisted',
      blockHash: 'File Hash Blocked',
      purgeMailbox: 'Mailboxes Purged',
      banIP: 'Attacker IP Banned'
    };
    toast.success(labelMap[type] || 'Action Successful', {
      icon: '🛡️',
      style: { background: '#0f172a', color: '#fff', border: '1px solid #10b981' }
    });
  };

  const handleEscalate = () => {
    setIsEscalated(true);
    toast.error('INCIDENT ESCALATED TO TIER 2', {
      icon: '🚨',
      style: { background: '#0f172a', color: '#fff', border: '1px solid #ef4444' }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-4xl bg-[#0a0f1d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-red/10 rounded-xl">
              <ShieldAlert className="text-neon-red" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Forensic Investigation</h2>
              <p className="text-xs text-slate-400">Target: <span className="text-neon-blue font-mono">{isPhishing ? scenario.sender : (scenario.user || 'Unknown User')}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <AlertCircle size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Steps */}
          <div className="w-64 border-r border-slate-800 bg-slate-900/20 p-4 space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  currentStep === index 
                    ? 'bg-neon-blue/10 border border-neon-blue/30 text-white' 
                    : completedSteps.includes(step.id)
                    ? 'text-neon-green/80 hover:bg-slate-800'
                    : 'text-slate-500 hover:bg-slate-800'
                }`}
              >
                {completedSteps.includes(step.id) ? <CheckCircle2 size={18} /> : step.icon}
                <span className="text-xs font-semibold uppercase tracking-tight">{step.title}</span>
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase px-2">Remediation</p>
              
              <button 
                onClick={() => handleRemediation('banIP')}
                disabled={remediations.banIP || blacklist.includes(alert.sourceIP)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold uppercase transition-all ${
                  remediations.banIP || blacklist.includes(alert.sourceIP) ? 'bg-neon-red/20 text-neon-red border border-neon-red/30 cursor-not-allowed' : 'bg-neon-red/10 text-neon-red border border-neon-red/20 hover:bg-neon-red/20'
                }`}
              >
                <ShieldX size={16} /> {remediations.banIP || blacklist.includes(alert.sourceIP) ? 'IP Banned' : 'Ban Attacker IP'}
              </button>

              {!isPhishing ? (
                <>
                  <button 
                    onClick={() => handleRemediation('passwordReset')}
                    disabled={remediations.passwordReset}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold uppercase transition-all ${
                      remediations.passwordReset ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <KeyRound size={16} /> Force Reset
                  </button>
                  <button 
                    onClick={() => handleRemediation('sessionRevoked')}
                    disabled={remediations.sessionRevoked}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold uppercase transition-all ${
                      remediations.sessionRevoked ? 'bg-neon-red/10 text-neon-red border border-neon-red/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <UserX size={16} /> Revoke Sessions
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleRemediation('blockDomain')}
                    disabled={remediations.blockDomain}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold uppercase transition-all ${
                      remediations.blockDomain ? 'bg-neon-red/10 text-neon-red border border-neon-red/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Globe size={16} /> Block Domain
                  </button>
                  <button 
                    onClick={() => handleRemediation('purgeMailbox')}
                    disabled={remediations.purgeMailbox}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold uppercase transition-all ${
                      remediations.purgeMailbox ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Trash2 size={16} /> Purge Mailboxes
                  </button>
                </>
              )}

              <button 
                onClick={handleEscalate}
                disabled={isEscalated}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold uppercase transition-all ${
                  isEscalated ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' : 'bg-neon-red/20 text-neon-red hover:bg-neon-red/30'
                }`}
              >
                <Zap size={16} /> {isEscalated ? 'Escalated' : 'Escalate'}
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-8 overflow-y-auto bg-slate-900/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-neon-blue/10 rounded-lg text-neon-blue">
                    {steps[currentStep].icon}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase">{steps[currentStep].title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{steps[currentStep].description}</p>

                {/* Account Compromise Steps */}
                {!isPhishing && currentStep === 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-panel p-4 border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Baseline (Last Known Good)</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">IP Address:</span>
                          <span className="text-white font-mono">{scenario.lastLogin?.ip}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Location:</span>
                          <span className="text-white">{scenario.lastLogin?.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="glass-panel p-4 border border-neon-red/30 bg-neon-red/5">
                      <p className="text-[10px] text-neon-red uppercase font-bold mb-2">Anomalous Activity</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">IP Address:</span>
                          <span className="text-neon-red font-mono">{scenario.currentLogin?.ip}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Location:</span>
                          <span className="text-neon-red">{scenario.currentLogin?.location}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCompleteStep('location', 'Anomalous IP from high-risk country')}
                      className="col-span-2 mt-4 p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all shadow-lg shadow-neon-blue/20"
                    >
                      Confirm Anomaly
                    </button>
                  </div>
                )}

                {!isPhishing && currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Navigation size={80} />
                      </div>
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Time difference:</span>
                          <span className="text-sm text-neon-blue font-bold">2 hours 14 mins</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Geographic distance:</span>
                          <span className="text-sm text-neon-blue font-bold">11,240 km</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                          <span className="text-xs text-slate-400 uppercase font-bold">Travel Velocity Required:</span>
                          <span className="text-lg text-neon-red font-bold animate-pulse font-mono">5,033 km/h</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-neon-red/10 border border-neon-red/30 rounded-xl flex items-start gap-3">
                      <AlertCircle className="text-neon-red mt-0.5" size={18} />
                      <p className="text-xs text-neon-red leading-relaxed font-bold uppercase tracking-tight">
                        Critical: Travel is physically impossible via commercial aviation. High confidence of credential theft.
                      </p>
                    </div>
                    <button 
                      onClick={() => handleCompleteStep('travel', 'Impossible travel confirmed: 5000+ km/h')}
                      className="w-full p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all"
                    >
                      Validate Findings
                    </button>
                  </div>
                )}

                {!isPhishing && currentStep === 2 && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-500 uppercase">Fingerprint Analysis</span>
                        <span className="text-[10px] px-2 py-0.5 bg-neon-red/20 text-neon-red border border-neon-red/30 rounded-full font-bold">MISMATCH</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 uppercase">Known Device</span>
                          <span className="text-xs text-white bg-slate-800 p-2 rounded-lg">{scenario.lastLogin?.device}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-neon-red uppercase">Attacker Device</span>
                          <span className="text-xs text-neon-red bg-neon-red/5 border border-neon-red/20 p-2 rounded-lg">{scenario.currentLogin?.device}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 uppercase">User Agent String</span>
                          <span className="text-[10px] font-mono text-slate-400 break-all bg-black/40 p-2 rounded-lg">{scenario.currentLogin?.userAgent}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCompleteStep('device', 'Device mismatch: MacBook vs Unknown Linux device')}
                      className="p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all"
                    >
                      Confirm Fingerprint Inconsistency
                    </button>
                  </div>
                )}

                {!isPhishing && currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {scenario.postLoginActivity?.map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-neon-red/30 transition-all">
                          <div className="flex items-center gap-3">
                            <Clock size={14} className="text-slate-500" />
                            <span className="text-xs text-slate-300 font-bold">{activity.action}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono italic">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-neon-red/5 border border-neon-red/20 rounded-xl">
                      <p className="text-[10px] text-neon-red uppercase font-bold mb-1">Impact Assessment</p>
                      <p className="text-xs text-slate-400">Attacker has already initiated data exfiltration (Customer List) and attempted to establish persistence (API Key change).</p>
                    </div>
                    <button 
                      onClick={() => handleCompleteStep('activity', 'Active exfiltration detected post-login')}
                      className="w-full p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all"
                    >
                      Log Activity Analysis
                    </button>
                  </div>
                )}

                {!isPhishing && currentStep === 4 && (
                  <div className="flex flex-col items-center justify-center p-8 space-y-6">
                    <div className="relative">
                      <ShieldAlert size={80} className="text-neon-red animate-pulse" />
                      <div className="absolute inset-0 bg-neon-red/20 blur-2xl rounded-full" />
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-lg font-bold text-white uppercase tracking-wider">MFA Not Triggered</h4>
                      <p className="text-sm text-slate-400 max-w-sm">
                        Verification reveals that Multi-Factor Authentication was <span className="text-neon-red font-bold">BYPASSED</span>. 
                        Likely session hijacking or MFA fatigue attack.
                      </p>
                    </div>
                    <div className="flex gap-4 w-full">
                      <div className="flex-1 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">MFA Status</p>
                        <p className="text-xs text-neon-red font-bold">BYPASSED / OFF</p>
                      </div>
                      <div className="flex-1 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Method</p>
                        <p className="text-xs text-white">SMS (UNAVAILABLE)</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCompleteStep('mfa', 'MFA bypass confirmed')}
                      className="w-full p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all"
                    >
                      Finish Investigation
                    </button>
                  </div>
                )}

                {/* Phishing Steps */}
                {isPhishing && currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(scenario.headers || {}).map(([key, value]) => (
                        <div key={key} className={`p-4 rounded-xl border ${value === 'PASS' ? 'bg-neon-green/5 border-neon-green/20' : 'bg-neon-red/5 border-neon-red/20'} text-center`}>
                          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{key}</p>
                          <p className={`text-xs font-bold ${value === 'PASS' ? 'text-neon-green' : 'text-neon-red'}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-neon-red font-bold">WARNING:</span> DKIM and DMARC failures suggest the email did not originate from the claimed server. Return-Path mismatch detected: <span className="text-white font-mono">{scenario.headers?.returnPath}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => handleCompleteStep('headers', 'SPF Pass, but DKIM/DMARC Fail: Spoofing confirmed')}
                      className="w-full p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all"
                    >
                      Confirm Header Anomaly
                    </button>
                  </div>
                )}

                {isPhishing && currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-400 uppercase">Sender Profile</span>
                        <AlertTriangle className="text-neon-yellow" size={16} />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase mb-1">Display Name</p>
                          <p className="text-sm text-white">{scenario.displaySender}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase mb-1">Email Address</p>
                          <p className="text-sm text-neon-red font-mono">{scenario.sender}</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCompleteStep('sender', 'Lookalike domain detected: enterprise-support.com (Legit is enterprise.com)')}
                      className="w-full p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all"
                    >
                      Validate Sender Identity
                    </button>
                  </div>
                )}

                {isPhishing && currentStep === 2 && (
                  <div className="space-y-4">
                    {scenario.links?.map((link, i) => (
                      <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                        <div className="flex items-center gap-2 text-neon-blue">
                          <Link size={16} />
                          <span className="text-xs font-bold uppercase">Link Analysis</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase mb-1">Display Text</p>
                            <p className="text-sm text-white underline decoration-neon-blue cursor-help" title={`Hovers to: ${link.hoverUrl}`}>{link.text}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className={`p-2 rounded border ${link.isMismatch ? 'bg-neon-red/10 border-neon-red/30' : 'bg-slate-800 border-slate-700'}`}>
                              <p className="text-[8px] text-slate-500 uppercase">Domain Mismatch</p>
                              <p className="text-[10px] font-bold text-neon-red">{link.isMismatch ? 'YES' : 'NO'}</p>
                            </div>
                            <div className={`p-2 rounded border ${link.isShortener ? 'bg-neon-yellow/10 border-neon-yellow/30' : 'bg-slate-800 border-slate-700'}`}>
                              <p className="text-[8px] text-slate-500 uppercase">URL Shortener</p>
                              <p className="text-[10px] font-bold text-neon-yellow">{link.isShortener ? 'YES' : 'NO'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase mb-1">Actual Destination</p>
                            <p className="text-[10px] text-neon-red font-mono break-all">{link.actualUrl}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => handleCompleteStep('links', 'Malicious link hidden behind shortener and domain mismatch')}
                      className="w-full p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all"
                    >
                      Confirm Malicious URL
                    </button>
                  </div>
                )}

                {isPhishing && currentStep === 3 && (
                  <div className="space-y-4">
                    {scenario.attachments?.map((file, i) => (
                      <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <ShieldCheck size={80} />
                        </div>
                        <div className="relative z-10 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-lg font-bold text-white">{file.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{file.hash}</p>
                            </div>
                            <span className="px-2 py-1 bg-neon-red/20 text-neon-red border border-neon-red/30 rounded text-[10px] font-bold uppercase">{file.status}</span>
                          </div>
                          <div className="p-3 bg-black/40 rounded-xl border border-slate-800">
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sandbox Findings</p>
                            <p className="text-xs text-neon-red">Detected behavior: Process Injection, Network callback to C2 server. Threat: {file.threat}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => handleCompleteStep('sandbox', 'Attachment security_patch.exe confirmed as Trojan')}
                      className="w-full p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all"
                    >
                      Log Sandbox Results
                    </button>
                  </div>
                )}

                {isPhishing && currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-3">Organization-wide Recipients</p>
                      <div className="space-y-2">
                        {scenario.recipients?.map((email, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                            <Mail size={14} className="text-neon-blue" />
                            <span className="text-xs text-white">{email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-neon-red/5 border border-neon-red/20 rounded-xl">
                      <p className="text-xs text-slate-400">Total of <span className="text-neon-red font-bold">3 users</span> received this email. Immediate mailbox purge recommended to prevent further compromise.</p>
                    </div>
                    <button 
                      onClick={() => handleCompleteStep('blast_radius', 'Blast radius: 3 users impacted')}
                      className="w-full p-3 bg-neon-blue text-slate-900 font-bold uppercase text-xs rounded-xl hover:bg-neon-blue/80 transition-all"
                    >
                      Finish Investigation
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-black border-t border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  completedSteps.includes(step.id) ? 'bg-neon-green shadow-[0_0_8px_#10b981]' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Investigation Progress: {Math.round((completedSteps.length / steps.length) * 100)}%</span>
            {completedSteps.length === steps.length && (
              <div className="flex items-center gap-2 text-neon-green font-bold text-[10px] uppercase animate-bounce">
                <CheckCircle2 size={12} /> Ready for Remediation
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvestigationModule;
