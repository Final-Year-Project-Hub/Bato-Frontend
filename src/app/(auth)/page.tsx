// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import LoginForm from "@/components/auth/LoginForm";
// import SignupForm from "@/components/auth/SignupForm";

// export default function AuthPage() {
//   const [showSignup, setShowSignup] = useState(false);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#1e465e] overflow-hidden">
//       <div className="relative w-[475px]">
//         <AnimatePresence mode="wait">
//           {!showSignup ? (
//             <motion.div
//               key="login"
//               initial={{ x: "-120%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "120%" }}
//               transition={{ duration: 0.5, ease: "easeInOut" }}
//             >
//               <LoginForm onSignup={() => setShowSignup(true)} />
//             </motion.div>
//           ) : (
//             <motion.div
//               key="signup"
//               initial={{ x: "120%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-120%" }}
//               transition={{ duration: 0.5, ease: "easeInOut" }}
//             >
//               <SignupForm onBack={() => setShowSignup(false)} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }
