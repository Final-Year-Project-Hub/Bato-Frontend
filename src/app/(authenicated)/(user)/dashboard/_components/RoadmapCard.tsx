// export type Roadmapcard = {
//   id: string;
//   title: string;
//   description: string;
//   progress: number; // 0-100
//   status: RoadmapStatus;
//   Icon: React.ElementType;
//   iconWrapClass: string;
//   iconClass: string;
//   statusWrapClass: string;
//   statusTextClass: string;
// };
// type RoadmapStatus = "Active" | "In Progress" | "Planned";

// export default function RoadmapCard({ item }: { item: Roadmapcard }) {
//   const {
//     title,
//     description,
//     progress,
//     status,
//     Icon,
//     iconWrapClass,
//     iconClass,
//     statusWrapClass,
//     statusTextClass,
//   } = item;

//   return (
//     <div className="rounded-2xl border border-white/25 bg-background/60 p-6">
//       {/* top row */}
//       <div className="flex items-start justify-between">
//         <div
//           className={`h-12 w-12 rounded-sm grid place-items-center ${iconWrapClass}`}
//         >
//           <Icon className={`h-4 w-4 ${iconClass}`} />
//         </div>

//         <span
//           className={`px-3 py-1 rounded-full text-sm font-medium ${statusWrapClass} ${statusTextClass}`}
//         >
//           {status}
//         </span>
//       </div>

//       {/* content */}
//       <div className="mt-6 space-y-3">
//         <h3 className="text-lg font-semibold text-primary">{title}</h3>
//         <p className="text-muted-foreground leading-relaxed">{description}</p>
//       </div>

//       {/* progress */}
//       <div className="mt-6 flex items-center gap-3">
//         <div className="h-3 w-px rounded-full bg-blue-500" />
//         <p className="text-emerald-400 font-medium">{progress}%</p>
//       </div>
//     </div>
//   );
// }
