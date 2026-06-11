import React, { useState } from 'react';
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
  UserX, 
  KeyRound, 
  ShieldCheck, 
  Mail, 
  Link, 
  Search, 
  Trash2, 
  AlertTriangle, 
  Fingerprint, 
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
      icon: <MapPin size={16} />,
      description: 'Validate if the current IP/Location is unusual for this user.'
    },
    { 
      id: 'travel', 
      title: 'Impossible Travel Analysis', 
      icon: <Navigation size={16} />,
      description: 'Calculate distance and time between last and current login.'
    },
    { 
      id: 'device', 
      title: 'Device & User Agent', 
      icon: <Laptop size={16} />,
      description: 'Check for browser/device fingerprint inconsistencies.'
    },
    { 
      id: 'activity', 
      title: 'Post-Login Activity', 
      icon: <FileSearch size={16} />,
      description: 'Review actions performed immediately after successful login.'
    },
    { 
      id: 'mfa', 
      title: 'MFA Verification', 
      icon: <ShieldCheck size={16} />,
      description: 'Determine if MFA was used, bypassed, or not configured.'
    }
  ];

  const phishingSteps = [
    {
      id: 'headers',
      title: 'Email Header Analysis',
      icon: <Mail size={16} />,
      description: 'Analyze SPF, DKIM, and DMARC status to identify spoofing.'
    },
    {
      id: 'sender',
      title: 'Sender Inspection',
      icon: <Fingerprint size={16} />,
      description: 'Check for lookalike domains and return-path mismatches.'
    },
    {
      id: 'links',
      title: 'Link Analysis',
      icon: <Link size={16} />,
      description: 'Verify URL destination vs display text and check for shorteners.'
    },
    {
      id: 'sandbox',
      title: 'Sandbox Analysis',
      icon: <ShieldCheck size={16} />,
      description: 'Execute attachments in an isolated environment to check for malware.'
    },
    {
      id: 'blast_radius',
      title: 'Blast Radius Search',
      icon: <Search size={16} />,
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
      style: { background: '#0b0b0b', color: '#fff', border: '1px solid #10b981' }
    });
  };

  const handleEscalate = () => {
    setIsEscalated(true);
    toast.error('INCIDENT ESCALATED TO TIER 2', {
      icon: '🚨',
      style: { background: '#0b0b0b', color: '#fff', border: '1px solid #ef4444' }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
    >
      <div 
        className="w-full max-w-4xl bg-[#050505] border border-white/5 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative"
        style={{ boxShadow: '0 24px 64px rgba(0, 0, 0, 0.9)' }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0b0b0b]/60">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-neon-red/10 border border-neon-red/20 rounded-xl">
              <ShieldAlert className="text-neon-red" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono">Forensic Playbook Console</h2>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">TARGET: <span className="text-neon-blue font-bold">{isPhishing ? scenario.sender : (scenario.user || 'Unknown User')}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 cursor-pointer transition-colors"
          >
            <AlertCircle size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Sidebar Steps */}
          <div className="w-full md:w-64 border-r border-white/5 bg-[#0b0b0b]/30 p-4 space-y-1.5 shrink-0 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest block px-2 mb-2 font-mono">Playbook Steps</span>
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer font-semibold uppercase tracking-wider font-mono text-[9px] text-left border ${
                    currentStep === index 
                      ? 'bg-gradient-to-r from-neon-purple/15 to-neon-blue/5 border-neon-purple/30 text-white shadow-[0_0_12px_rgba(124,58,237,0.1)]' 
                      : completedSteps.includes(step.id)
                      ? 'text-neon-green/80 border-transparent hover:bg-white/[0.01]'
                      : 'text-slate-500 border-transparent hover:bg-white/[0.01]'
                  }`}
                >
                  {completedSteps.includes(step.id) ? <CheckCircle2 size={14} className="text-neon-green shrink-0" /> : <span className="shrink-0">{step.icon}</span>}
                  <span className="truncate">{step.title}</span>
                </button>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/5 space-y-2 mt-4 md:mt-0">
              <span className="text-[8px] font-extrabold text-slate-500 uppercase px-2 tracking-widest font-mono block">Remediations</span>
              
              <button 
                onClick={() => handleRemediation('banIP')}
                disabled={remediations.banIP || blacklist.includes(alert.sourceIP)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-[9px] font-extrabold uppercase font-mono tracking-widest border transition-all cursor-pointer ${
                  remediations.banIP || blacklist.includes(alert.sourceIP) 
                    ? 'bg-neon-red/10 text-neon-red border-neon-red/20 cursor-not-allowed' 
                    : 'bg-neon-red/5 text-neon-red border-neon-red/20 hover:bg-neon-red/10'
                }`}
              >
                <ShieldX size={14} /> {remediations.banIP || blacklist.includes(alert.sourceIP) ? 'IP_BANNED' : 'BAN_ATTACKER_IP'}
              </button>

              {!isPhishing ? (
                <>
                  <button 
                    onClick={() => handleRemediation('passwordReset')}
                    disabled={remediations.passwordReset}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-[9px] font-extrabold uppercase font-mono tracking-widest border transition-all cursor-pointer ${
                      remediations.passwordReset ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <KeyRound size={14} /> RESET_CREDENTIALS
                  </button>
                  <button 
                    onClick={() => handleRemediation('sessionRevoked')}
                    disabled={remediations.sessionRevoked}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-[9px] font-extrabold uppercase font-mono tracking-widest border transition-all cursor-pointer ${
                      remediations.sessionRevoked ? 'bg-neon-red/10 text-neon-red border-neon-red/20' : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <UserX size={14} /> REVOKE_SESSIONS
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleRemediation('blockDomain')}
                    disabled={remediations.blockDomain}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-[9px] font-extrabold uppercase font-mono tracking-widest border transition-all cursor-pointer ${
                      remediations.blockDomain ? 'bg-neon-red/10 text-neon-red border-neon-red/20' : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <Globe size={14} /> BLOCK_DOMAIN
                  </button>
                  <button 
                    onClick={() => handleRemediation('purgeMailbox')}
                    disabled={remediations.purgeMailbox}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-[9px] font-extrabold uppercase font-mono tracking-widest border transition-all cursor-pointer ${
                      remediations.purgeMailbox ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <Trash2 size={14} /> PURGE_MAILBOXES
                  </button>
                </>
              )}

              <button 
                onClick={handleEscalate}
                disabled={isEscalated}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-[9px] font-extrabold uppercase font-mono tracking-widest border transition-all cursor-pointer ${
                  isEscalated 
                    ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/40 shadow-[0_0_12px_rgba(124,58,237,0.1)]' 
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                <Zap size={14} /> {isEscalated ? 'ESCALATED' : 'ESCALATE_T2'}
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#050505]/40 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="p-2 bg-neon-purple/10 border border-neon-purple/20 rounded-lg text-neon-purple">
                    {steps[currentStep].icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono">{steps[currentStep].title}</h3>
                    <p className="text-[10px] text-slate-500 font-sans mt-0.5">{steps[currentStep].description}</p>
                  </div>
                </div>

                {/* Account Compromise Page Specifics */}
                {!isPhishing && currentStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-panel p-4.5 border border-white/5 bg-[#0b0b0b]/60 relative">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      <p className="text-[9px] text-slate-500 uppercase font-extrabold mb-3 font-mono tracking-widest">Baseline (Good state)</p>
                      <div className="space-y-2.5 font-mono text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">IP Address:</span>
                          <span className="text-white font-bold">{scenario.lastLogin?.ip}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Location:</span>
                          <span className="text-white font-bold">{scenario.lastLogin?.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-panel p-4.5 border border-neon-red/20 bg-neon-red/[0.02] relative">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-red/25 to-transparent"></div>
                      <p className="text-[9px] text-neon-red uppercase font-extrabold mb-3 font-mono tracking-widest">Anomalous Activity</p>
                      <div className="space-y-2.5 font-mono text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">IP Address:</span>
                          <span className="text-neon-red font-bold">{scenario.currentLogin?.ip}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Location:</span>
                          <span className="text-neon-red font-bold">{scenario.currentLogin?.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleCompleteStep('location', 'Anomalous IP from high-risk country')}
                      className="md:col-span-2 mt-4 p-3 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Confirm Anomaly & Continue
                    </button>
                  </div>
                )}

                {!isPhishing && currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="p-6 bg-[#0b0b0b]/60 rounded-2xl border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-neon-purple">
                        <Navigation size={80} />
                      </div>
                      <div className="space-y-4 relative z-10 font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 uppercase text-[9px] tracking-wider">Time Difference:</span>
                          <span className="text-neon-purple font-bold">2 hours 14 mins</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 uppercase text-[9px] tracking-wider">Geographic Distance:</span>
                          <span className="text-neon-purple font-bold">11,240 km</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <span className="text-slate-400 uppercase font-extrabold text-[9px] tracking-widest">Velocity Required:</span>
                          <span className="text-lg text-neon-red font-extrabold animate-pulse font-mono tracking-tight" style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}>5,033 km/h</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-neon-red/5 border border-neon-red/25 rounded-xl flex items-start gap-3">
                      <AlertCircle className="text-neon-red mt-0.5 shrink-0" size={16} />
                      <p className="text-[10px] text-neon-red font-bold uppercase tracking-wide leading-relaxed font-mono">
                        CRITICAL: Impossible travel verified. High confidence score of credential theft.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleCompleteStep('travel', 'Impossible travel confirmed: 5000+ km/h')}
                      className="w-full p-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Confirm Findings
                    </button>
                  </div>
                )}

                {!isPhishing && currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="p-5 bg-[#0b0b0b]/60 border border-white/5 rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest font-mono">Fingerprint Analysis</span>
                        <span className="text-[8px] px-2 py-0.5 bg-neon-red/10 text-neon-red border border-neon-red/20 rounded-full font-bold font-mono">MISMATCH</span>
                      </div>
                      
                      <div className="space-y-3.5 font-mono text-[10px]">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[8px] text-slate-500 uppercase tracking-wider">Known Good Device</span>
                          <span className="text-slate-300 bg-[#050505]/60 border border-white/5 p-2 rounded-lg font-bold">{scenario.lastLogin?.device}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[8px] text-neon-red uppercase tracking-wider">Current Attacker Device</span>
                          <span className="text-neon-red bg-neon-red/5 border border-neon-red/20 p-2 rounded-lg font-bold">{scenario.currentLogin?.device}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[8px] text-slate-500 uppercase tracking-wider">User Agent Header</span>
                          <span className="text-[9px] text-slate-500 bg-[#050505] p-2.5 rounded-lg break-all border border-white/5 leading-relaxed">{scenario.currentLogin?.userAgent}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleCompleteStep('device', 'Device mismatch: MacBook vs Unknown Linux device')}
                      className="w-full p-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Log Device Inconsistency
                    </button>
                  </div>
                )}

                {!isPhishing && currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2.5">
                      {scenario.postLoginActivity?.map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-[#0b0b0b]/60 border border-white/5 rounded-xl hover:border-neon-purple/20 transition-all font-mono text-xs">
                          <div className="flex items-center gap-3">
                            <Clock size={13} className="text-slate-500" />
                            <span className="text-slate-300 font-bold">{activity.action}</span>
                          </div>
                          <span className="text-[9px] text-slate-500 italic font-medium">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-neon-red/5 border border-neon-red/25 rounded-xl font-mono text-[9px] text-slate-400 leading-relaxed uppercase">
                      <span className="text-neon-red font-bold">Alert Assessment:</span> Attacker exfiltrating logs and changing persistence (API keys, customer CSV lists).
                    </div>
                    
                    <button 
                      onClick={() => handleCompleteStep('activity', 'Active exfiltration detected post-login')}
                      className="w-full p-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Log Activity Analysis
                    </button>
                  </div>
                )}

                {!isPhishing && currentStep === 4 && (
                  <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
                    <div className="relative">
                      <ShieldAlert size={60} className="text-neon-red animate-pulse" />
                      <div className="absolute inset-0 bg-neon-red/15 blur-xl rounded-full" />
                    </div>
                    
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-widest font-mono">MFA Verification Bypassed</h4>
                      <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                        Verification confirms Multi-Factor Authentication was <span className="text-neon-red font-bold uppercase">Bypassed</span>. Session hijacking or token extraction is highly suspected.
                      </p>
                    </div>
                    
                    <div className="flex gap-4 w-full font-mono text-xs">
                      <div className="flex-1 p-4 bg-[#0b0b0b]/60 border border-white/5 rounded-2xl">
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-neon-red font-extrabold text-[10px]">BYPASS / FAILS</p>
                      </div>
                      <div className="flex-1 p-4 bg-[#0b0b0b]/60 border border-white/5 rounded-2xl">
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">MFA Method</p>
                        <p className="text-slate-300 font-bold text-[10px]">SMS CODE</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleCompleteStep('mfa', 'MFA bypass confirmed')}
                      className="w-full p-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Finish Forensic Playbook
                    </button>
                  </div>
                )}

                {/* Phishing Page Specifics */}
                {isPhishing && currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(scenario.headers || {}).map(([key, value]) => (
                        <div key={key} className={`p-4 rounded-xl border ${value === 'PASS' ? 'bg-neon-green/5 border-neon-green/20' : 'bg-neon-red/5 border-neon-red/20'} text-center font-mono`}>
                          <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1.5">{key}</p>
                          <p className={`text-[10px] font-extrabold ${value === 'PASS' ? 'text-neon-green' : 'text-neon-red'}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-[#0b0b0b]/60 border border-white/5 rounded-xl font-mono text-[9px] text-slate-400 leading-relaxed uppercase">
                      <span className="text-neon-red font-bold">WARNING:</span> DKIM and DMARC checks rejected. returnPath spoofing target: <span className="text-white font-bold">{scenario.headers?.returnPath}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleCompleteStep('headers', 'SPF Pass, but DKIM/DMARC Fail: Spoofing confirmed')}
                      className="w-full p-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Log Header Anomalies
                    </button>
                  </div>
                )}

                {isPhishing && currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="p-5 bg-[#0b0b0b]/60 border border-white/5 rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest font-mono">Sender Profiles</span>
                        <AlertTriangle className="text-neon-yellow animate-bounce" size={16} />
                      </div>
                      <div className="space-y-3.5 font-mono text-[10px]">
                        <div>
                          <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Display Label</p>
                          <p className="text-xs text-white font-bold">{scenario.displaySender}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">True Envelope Address</p>
                          <p className="text-xs text-neon-red font-bold">{scenario.sender}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleCompleteStep('sender', 'Lookalike domain detected: enterprise-support.com (Legit is enterprise.com)')}
                      className="w-full p-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Confirm Sender Mismatch
                    </button>
                  </div>
                )}

                {isPhishing && currentStep === 2 && (
                  <div className="space-y-4">
                    {scenario.links?.map((linkItem, i) => (
                      <div key={i} className="p-5 bg-[#0b0b0b]/60 border border-white/5 rounded-xl space-y-4">
                        <div className="flex items-center gap-2 text-neon-blue pb-2 border-b border-white/5">
                          <Link size={14} />
                          <span className="text-[9px] font-extrabold uppercase tracking-widest font-mono">Link Vector Scan</span>
                        </div>
                        <div className="space-y-3.5 font-mono text-[10px]">
                          <div>
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Text display</p>
                            <p className="text-xs text-white underline decoration-neon-blue cursor-help font-bold">{linkItem.text}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className={`p-2.5 rounded-lg border ${linkItem.isMismatch ? 'bg-neon-red/5 border-neon-red/20 text-neon-red' : 'bg-white/[0.01] border-white/5'}`}>
                              <p className="text-[7px] text-slate-500 uppercase">Domain Mismatch</p>
                              <p className="text-[9px] font-extrabold mt-1">{linkItem.isMismatch ? 'YES' : 'NO'}</p>
                            </div>
                            <div className={`p-2.5 rounded-lg border ${linkItem.isShortener ? 'bg-neon-yellow/5 border-neon-yellow/20 text-neon-yellow' : 'bg-white/[0.01] border-white/5'}`}>
                              <p className="text-[7px] text-slate-500 uppercase">URL Shortener</p>
                              <p className="text-[9px] font-extrabold mt-1">{linkItem.isShortener ? 'YES' : 'NO'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Raw Destination</p>
                            <p className="text-[9px] text-neon-red font-mono break-all font-bold">{linkItem.actualUrl}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => handleCompleteStep('links', 'Malicious link hidden behind shortener and domain mismatch')}
                      className="w-full p-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Log Link Findings
                    </button>
                  </div>
                )}

                {isPhishing && currentStep === 3 && (
                  <div className="space-y-4">
                    {scenario.attachments?.map((file, i) => (
                      <div key={i} className="p-6 bg-[#0b0b0b]/60 border border-white/5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-neon-red pointer-events-none">
                          <ShieldCheck size={80} />
                        </div>
                        <div className="relative z-10 space-y-4 font-mono text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold text-white uppercase tracking-tight">{file.name}</p>
                              <p className="text-[8px] text-slate-500 mt-1 font-mono break-all">HASH: {file.hash}</p>
                            </div>
                            <span className="px-2.5 py-1 bg-neon-red/10 text-neon-red border border-neon-red/20 rounded text-[9px] font-bold uppercase tracking-wider">{file.status}</span>
                          </div>
                          
                          <div className="p-3 bg-black/60 rounded-xl border border-white/5">
                            <p className="text-[8px] text-slate-500 uppercase font-extrabold mb-1 tracking-widest">Sandbox Output</p>
                            <p className="text-[9px] text-neon-red leading-relaxed uppercase">Process Injection, network C2 callback detected. Threat Signature: {file.threat}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => handleCompleteStep('sandbox', 'Attachment security_patch.exe confirmed as Trojan')}
                      className="w-full p-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Log Sandbox Results
                    </button>
                  </div>
                )}

                {isPhishing && currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0b0b0b]/60 border border-white/5 rounded-xl space-y-3">
                      <p className="text-[8px] text-slate-500 uppercase font-extrabold tracking-widest font-mono">Blast Radius Recipients</p>
                      <div className="space-y-2">
                        {scenario.recipients?.map((email, i) => (
                          <div key={i} className="flex items-center gap-3.5 p-2.5 bg-[#050505]/40 rounded-xl border border-white/5 font-mono text-[10px]">
                            <Mail size={12} className="text-neon-purple shrink-0" />
                            <span className="text-slate-300 font-bold">{email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-neon-red/5 border border-neon-red/25 rounded-xl font-mono text-[9px] text-slate-400 leading-relaxed uppercase">
                      Total <span className="text-neon-red font-bold">3 users</span> received this vector. Mailbox purge recommended.
                    </div>
                    
                    <button 
                      onClick={() => handleCompleteStep('blast_radius', 'Blast radius: 3 users impacted')}
                      className="w-full p-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold uppercase tracking-widest text-[9px] font-mono rounded-xl shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
                    >
                      Finish Forensic Playbook
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Progress Tracker */}
        <div className="p-4.5 bg-black border-t border-white/5 flex items-center justify-between font-mono text-[9px]">
          <div className="flex gap-2">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  completedSteps.includes(step.id) ? 'bg-neon-green shadow-[0_0_6px_#10b981]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 uppercase font-bold tracking-wider">Progress: {Math.round((completedSteps.length / steps.length) * 100)}%</span>
            {completedSteps.length === steps.length && (
              <div className="flex items-center gap-1.5 text-neon-green font-extrabold uppercase animate-bounce">
                <CheckCircle2 size={12} /> PLAYBOOK_RESOLVED
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvestigationModule;
