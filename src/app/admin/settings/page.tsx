// "use client";

// import { Save, Key, Database, FileText, Mail, DollarSign, Settings as SettingsIcon } from "lucide-react";
// import { useState } from "react";

// export default function SettingsPage() {
//   const [saved, setSaved] = useState(false);

//   const handleSave = () => {
//     setSaved(true);
//     setTimeout(() => setSaved(false), 3000);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-foreground mb-2">Platform Settings</h1>
//         <p className="text-foreground/60">Configure your platform and system preferences</p>
//       </div>

//       {/* Settings Sections */}
//       <div className="space-y-6">
//         {/* LLM Configuration */}
//         <div className="bg-background rounded-2xl border border-border p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//               <Key className="w-5 h-5 text-primary" />
//             </div>
//             <h2 className="text-xl font-bold text-foreground">LLM Configuration</h2>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">OpenAI API Key</label>
//               <input
//                 type="password"
//                 placeholder="sk-..."
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Anthropic API Key</label>
//               <input
//                 type="password"
//                 placeholder="sk-ant-..."
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Default Model</label>
//               <select className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
//                 <option>GPT-4</option>
//                 <option>GPT-3.5 Turbo</option>
//                 <option>Claude 3 Opus</option>
//                 <option>Claude 3 Sonnet</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Monthly Cost Threshold ($)</label>
//               <input
//                 type="number"
//                 defaultValue="5000"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//               <p className="text-xs text-foreground/50 mt-1">Alert when monthly LLM costs exceed this amount</p>
//             </div>
//           </div>
//         </div>

//         {/* Vector Database Settings */}
//         <div className="bg-background rounded-2xl border border-border p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//               <Database className="w-5 h-5 text-primary" />
//             </div>
//             <h2 className="text-xl font-bold text-foreground">Vector Database</h2>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Database Type</label>
//               <select className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
//                 <option>Pinecone</option>
//                 <option>Weaviate</option>
//                 <option>Qdrant</option>
//                 <option>Chroma</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
//               <input
//                 type="password"
//                 placeholder="Enter vector DB API key"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Environment</label>
//               <input
//                 type="text"
//                 placeholder="e.g., us-east-1"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Embedding Model</label>
//               <select className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
//                 <option>text-embedding-ada-002</option>
//                 <option>text-embedding-3-small</option>
//                 <option>text-embedding-3-large</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* File Upload Settings */}
//         <div className="bg-background rounded-2xl border border-border p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//               <FileText className="w-5 h-5 text-primary" />
//             </div>
//             <h2 className="text-xl font-bold text-foreground">File Upload Configuration</h2>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Max File Size (MB)</label>
//               <input
//                 type="number"
//                 defaultValue="50"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Allowed File Types</label>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
//                 {['PDF', 'DOCX', 'TXT', 'MD', 'CSV', 'JSON', 'XML', 'HTML'].map((type) => (
//                   <label key={type} className="flex items-center gap-2 p-3 bg-grey rounded-lg cursor-pointer hover:bg-grey/70 transition-colors">
//                     <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
//                     <span className="text-sm">{type}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Storage Quota per User (GB)</label>
//               <input
//                 type="number"
//                 defaultValue="10"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="flex items-center justify-between p-4 bg-grey rounded-lg">
//               <div>
//                 <div className="font-medium text-foreground">Auto-convert to Vector DB</div>
//                 <div className="text-sm text-foreground/60">Automatically ingest uploaded documents</div>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input type="checkbox" className="sr-only peer" defaultChecked />
//                 <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Email & Notifications */}
//         <div className="bg-background rounded-2xl border border-border p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//               <Mail className="w-5 h-5 text-primary" />
//             </div>
//             <h2 className="text-xl font-bold text-foreground">Email & Notifications</h2>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">SMTP Host</label>
//               <input
//                 type="text"
//                 placeholder="smtp.gmail.com"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">SMTP Port</label>
//                 <input
//                   type="number"
//                   defaultValue="587"
//                   className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">SMTP Username</label>
//                 <input
//                   type="text"
//                   placeholder="your-email@example.com"
//                   className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">SMTP Password</label>
//               <input
//                 type="password"
//                 placeholder="App password"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">From Email</label>
//               <input
//                 type="email"
//                 placeholder="noreply@bato.ai"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="space-y-3 pt-2">
//               <div className="font-medium text-foreground">Notification Triggers</div>
//               {[
//                 'New user registration',
//                 'New roadmap creation',
//                 'Payment received',
//                 'LLM cost threshold reached',
//                 'System errors'
//               ].map((trigger) => (
//                 <div key={trigger} className="flex items-center justify-between p-3 bg-grey rounded-lg">
//                   <span className="text-sm text-foreground">{trigger}</span>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input type="checkbox" className="sr-only peer" defaultChecked />
//                     <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Platform Configuration */}
//         <div className="bg-background rounded-2xl border border-border p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//               <SettingsIcon className="w-5 h-5 text-primary" />
//             </div>
//             <h2 className="text-xl font-bold text-foreground">Platform Configuration</h2>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Platform Name</label>
//               <input
//                 type="text"
//                 defaultValue="Bato.ai"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">Support Email</label>
//               <input
//                 type="email"
//                 defaultValue="support@bato.ai"
//                 className="w-full bg-grey border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="flex items-center justify-between p-4 bg-grey rounded-lg">
//               <div>
//                 <div className="font-medium text-foreground">User Registration</div>
//                 <div className="text-sm text-foreground/60">Allow new users to register</div>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input type="checkbox" className="sr-only peer" defaultChecked />
//                 <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
//               </label>
//             </div>
//             <div className="flex items-center justify-between p-4 bg-grey rounded-lg">
//               <div>
//                 <div className="font-medium text-foreground">Maintenance Mode</div>
//                 <div className="text-sm text-foreground/60">Disable platform access for maintenance</div>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input type="checkbox" className="sr-only peer" />
//                 <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Pricing Plans */}
//         <div className="bg-background rounded-2xl border border-border p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//               <DollarSign className="w-5 h-5 text-primary" />
//             </div>
//             <h2 className="text-xl font-bold text-foreground">Pricing Plans</h2>
//           </div>
//           <div className="space-y-4">
//             {[
//               { name: 'Free', price: 0, features: '5 roadmaps, basic support' },
//               { name: 'Pro', price: 29, features: 'Unlimited roadmaps, priority support' },
//               { name: 'Enterprise', price: 99, features: 'Everything + API access' }
//             ].map((plan) => (
//               <div key={plan.name} className="p-4 bg-grey rounded-lg">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="font-medium text-foreground">{plan.name}</div>
//                   <div className="text-lg font-bold text-primary">${plan.price}/mo</div>
//                 </div>
//                 <div className="text-sm text-foreground/60 mb-3">{plan.features}</div>
//                 <button className="text-sm text-primary hover:underline">Edit Plan</button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Save Button */}
//         <button 
//           onClick={handleSave}
//           className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
//         >
//           <Save className="w-4 h-4" />
//           {saved ? 'Settings Saved!' : 'Save All Settings'}
//         </button>
//       </div>
//     </div>
//   );
// }

export default function Page(){
    return(
        <main>
            Settings
        </main>
    )
}