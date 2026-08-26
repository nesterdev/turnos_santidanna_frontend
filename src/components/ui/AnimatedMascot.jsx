import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { QUOTES, getRandom } from "../../lib/utils/quotes";

export default function AnimatedMascot({
    email = "",
    password = "",
    isFocusEmail = false,
    isFocusPassword = false,
    showPassword = false,
    isError = false,
    isSuccess = false,
    isLoading = false
}) {
    const [blinking, setBlinking] = useState(false);
    const [speechText, setSpeechText] = useState(QUOTES.welcome[0]);
    const [thoughtChar, setThoughtChar] = useState("");
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const containerRef = useRef(null);
    const prevPassLength = useRef(0);

    const emailLower = email.toLowerCase().trim();
    const emailLength = email.length;
    const passLength = password.length;

    const TARGET_DANNA = "dannafer_2000@hotmail.com";
    const isDannaExact = emailLower === TARGET_DANNA;
    const isDannaSuspect = !isDannaExact && TARGET_DANNA.startsWith(emailLower) && emailLower.length > 0;

    // Generador ajustado: Máximo 3 caracteres visuales en la nube
    const generateMysteriousGuess = (str) => {
        if (!str) return { display: "", snippet: "", isReal: false };

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        const len = str.length;

        let displayArray = [];

        if (len <= 3) {
            displayArray = str.split("").map((char, index) =>
                index % 2 === 0 ? char : chars.charAt(Math.floor(Math.random() * chars.length))
            );
        } else {
            const sliced = str.slice(-3);
            displayArray = sliced.split("").map((c, i) => (i % 2 === 0 ? c : "*"));
        }

        const display = displayArray.join("");

        const snippetChars = displayArray.filter(c => c !== "*").slice(-2);
        const snippet = (snippetChars.length > 0 ? snippetChars.join("*") : "?") + "?";

        return {
            display,
            snippet,
            isReal: len % 2 === 0
        };
    };

    // Pestañeo natural
    useEffect(() => {
        const interval = setInterval(() => {
            setBlinking(true);
            setTimeout(() => setBlinking(false), 150);
        }, 3500 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    // Tracking del mouse
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const deltaX = e.clientX - (rect.left + rect.width / 2);
            const deltaY = e.clientY - (rect.top + rect.height / 2);
            const angle = Math.atan2(deltaY, deltaX);
            const distance = Math.min(Math.hypot(deltaX, deltaY) / 15, 5);

            setMousePos({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // GESTIÓN UNIFICADA DE ESTADOS Y REACCIONES
    useEffect(() => {
        let nextQuote = "";
        const isTypingPassword = passLength > prevPassLength.current;
        const lastChar = password.slice(-1);

        // 1. Gestión de la nube de pensamiento
        if (isFocusPassword && passLength > 0 && !showPassword) {
            const { display } = generateMysteriousGuess(password);
            setThoughtChar(display);
        } else {
            setThoughtChar("");
        }

        // 2. Evaluador de Reacciones
        if (isFocusPassword && showPassword) {
            const revealPool = (isDannaExact || isDannaSuspect)
                ? (QUOTES.passwordREVEALED?.danna || QUOTES.passwordREVEALED)
                : (QUOTES.passwordREVEALED?.default || QUOTES.passwordREVEALED);

            nextQuote = getRandom(revealPool);

        } else if (!isFocusPassword && showPassword && passLength > 0) {
            const stillRevealPool = (isDannaExact || isDannaSuspect)
                ? (QUOTES.passwordStillRevealed?.danna || QUOTES.passwordStillRevealed)
                : (QUOTES.passwordStillRevealed?.default || QUOTES.passwordStillRevealed);

            nextQuote = getRandom(stillRevealPool);

        } else if (isFocusPassword && passLength > 0 && !showPassword) {
            if (isTypingPassword && lastChar) {
                if (/\d/.test(lastChar)) {
                    nextQuote = getRandom(QUOTES.passwordReactions.number);
                } else if (/[!@#$%^&*(),.?":{}|<>]/.test(lastChar)) {
                    nextQuote = getRandom(QUOTES.passwordReactions.special);
                } else if (/[A-Z]/.test(lastChar)) {
                    nextQuote = getRandom(QUOTES.passwordReactions.uppercase);
                } else if (passLength % 2 === 0) {
                    const { snippet } = generateMysteriousGuess(password);
                    const guessPool = (isDannaExact || isDannaSuspect)
                        ? (QUOTES.nearGuess?.danna || QUOTES.passwordReactions.nearGuess)
                        : (QUOTES.nearGuess?.default || QUOTES.passwordReactions.nearGuess);

                    const quoteFn = getRandom(guessPool);
                    nextQuote = typeof quoteFn === "function" ? quoteFn(snippet) : quoteFn;
                } else if (passLength % 3 === 0) {
                    nextQuote = getRandom(QUOTES.passwordReactions.guessSuccess);
                }
            }
        } else if (isFocusPassword && !showPassword && passLength === 0) {
            nextQuote = getRandom(QUOTES.passwordHidden);
        } else if (isFocusEmail) {
            if (isDannaExact) {
                nextQuote = getRandom(QUOTES.dannaSpecial);
            } else if (isDannaSuspect) {
                nextQuote = getRandom(QUOTES.dannaSuspect);
            } else if (emailLower.includes("@gmail.com")) {
                nextQuote = getRandom(QUOTES.emailDomain.gmail);
            } else if (emailLower.includes("@hotmail.com") || emailLower.includes("@outlook.com")) {
                nextQuote = getRandom(QUOTES.emailDomain.outlook);
            } else if (emailLower.includes(".edu") || emailLower.includes(".gov")) {
                nextQuote = getRandom(QUOTES.emailDomain.institutional);
            } else if (emailLength > 22) {
                nextQuote = getRandom(QUOTES.emailVeryLong);
            } else if (emailLength > 0) {
                nextQuote = getRandom(QUOTES.emailShort);
            } else {
                nextQuote = getRandom(QUOTES.welcome);
            }
        }

        // 3. Estados globales
        if (isSuccess) {
            nextQuote = getRandom(QUOTES.success);
        } else if (isError) {
            nextQuote = getRandom(QUOTES.error);
        } else if (isLoading) {
            nextQuote = getRandom(QUOTES.loading);
        }

        if (nextQuote) {
            setSpeechText(nextQuote);
        }

        prevPassLength.current = passLength;
    }, [
        password,
        passLength,
        email,
        emailLower,
        isDannaExact,
        isDannaSuspect,
        isFocusEmail,
        isFocusPassword,
        showPassword,
        isError,
        isSuccess,
        isLoading
    ]);

    const isCoveringEyes = showPassword;
    const isHidingPassword = isFocusPassword && !showPassword;

    let targetEyeX = mousePos.x;
    let targetEyeY = mousePos.y;

    if (isHidingPassword) {
        targetEyeX = 3;
        targetEyeY = 6;
    } else if (isFocusEmail && emailLength > 0) {
        targetEyeX = Math.min(Math.max((emailLength - 12) * 0.4, -6), 6);
        targetEyeY = 6;
    }

    return (
        <div ref={containerRef} className="relative w-40 h-40 mx-auto mb-6 flex flex-col items-center justify-center select-none overflow-visible">

            {/* NUBE DE PENSAMIENTO (REDISÉÑADA ESTILO NUBE BLANCA/AZUL Y CERCA DE LA MASCOTA) */}
{/* NUBE DE PENSAMIENTO */}
<AnimatePresence>
    {isFocusPassword && passLength > 0 && thoughtChar && (
        <motion.div
            initial={{ opacity: 0, scale: 0.3, x: -10, y: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, x: -10, y: -10 }}
            className="absolute -top-1 -right-8 z-30 pointer-events-none flex flex-col items-start"
        >
            {/* Cuerpo de la nube */}
            <div className="relative px-4 py-2 flex items-center justify-center min-w-[65px] h-10">
                {/* Fondos redondos combinados para forma de nube esponjosa */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-sky-50 to-blue-100 shadow-lg shadow-sky-900/15 border border-white/80" />
                <div className="absolute -top-3 left-2 w-7 h-7 rounded-full bg-gradient-to-b from-white to-sky-50 border-t border-white/90" />
                <div className="absolute -top-4 right-3 w-8 h-8 rounded-full bg-gradient-to-b from-white to-sky-50 border-t border-white/90" />
                <div className="absolute -bottom-1.5 left-4 w-5 h-5 rounded-full bg-gradient-to-t from-blue-100 to-sky-50" />

                {/* Texto gris semi-transparente */}
                <div className="relative z-10 font-mono text-xs text-slate-500/75 font-black tracking-widest drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    {thoughtChar}
                </div>
            </div>

            {/* Burbujitas conectoras apuntando a la cabeza */}
            <div className="ml-1 -mt-0.5 flex flex-col gap-1 items-start">
                <span className="w-2.5 h-2.5 bg-gradient-to-br from-white to-sky-100 rounded-full shadow-sm border border-white/80" />
                <span className="w-1.5 h-1.5 bg-gradient-to-br from-white to-sky-100 rounded-full -ml-2 shadow-xs border border-white/80" />
            </div>
        </motion.div>
    )}
</AnimatePresence>

            {/* DIÁLOGO PRINCIPAL */}
            <div className="absolute -top-12 z-20 pointer-events-none w-full flex justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={speechText}
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.9 }}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border whitespace-nowrap backdrop-blur-xs flex items-center gap-1 ${isDannaExact
                            ? "bg-rose-900/90 text-pink-200 border-pink-500/50"
                            : isDannaSuspect
                                ? "bg-purple-900/90 text-purple-200 border-purple-500/50"
                                : "bg-slate-900/90 text-white border-slate-700"
                            }`}
                    >
                        {speechText}
                    </motion.div>
                </AnimatePresence>
            </div>

            <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
                <motion.ellipse cx="60" cy="112" rx="36" ry="5" fill="#000000" opacity="0.15" animate={{ scale: isSuccess ? [1, 1.3, 1] : 1 }} />

                {/* CABEZA */}
                <motion.circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill={isDannaExact ? "#2D1B2D" : isDannaSuspect ? "#241835" : "#1E293B"}
                    animate={{
                        scale: isSuccess ? [1, 1.15, 1] : isError ? [1, 0.9, 1] : 1,
                        y: isSuccess ? [0, -14, 0] : isCoveringEyes ? 4 : isFocusPassword ? 8 : 0,
                        x: isCoveringEyes ? [0, -3, 3, 0] : 0,
                        rotate: isCoveringEyes ? -15 : isFocusPassword ? -8 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                />

                {/* OREJAS */}
                <motion.circle cx="14" cy="50" r="9" fill={isDannaExact ? "#1F1020" : isDannaSuspect ? "#190D28" : "#0F172A"} />
                <motion.circle cx="106" cy="50" r="9" fill={isDannaExact ? "#1F1020" : isDannaSuspect ? "#190D28" : "#0F172A"} />

                {/* GOTITA DE SUDOR */}
                {isHidingPassword && passLength > 8 && (
                    <motion.path
                        d="M 28 35 Q 26 28 31 25 Q 36 28 34 35 Z"
                        fill="#38BDF8"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: [0.4, 1, 0.8], y: [0, 6, 12] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                )}

                {/* CEJAS */}
                <motion.g animate={{ y: isCoveringEyes ? -6 : isFocusPassword ? 2 : isError ? 3 : 0 }}>
                    <path d="M 33 37 Q 42 32 49 38" fill="none" stroke={isDannaExact ? "#F472B6" : isDannaSuspect ? "#C084FC" : "#64748B"} strokeWidth="3" strokeLinecap="round" />
                    <path d="M 71 38 Q 78 32 87 37" fill="none" stroke={isDannaExact ? "#F472B6" : isDannaSuspect ? "#C084FC" : "#64748B"} strokeWidth="3" strokeLinecap="round" />
                </motion.g>

                {/* OJOS */}
                <g>
                    <circle cx="42" cy="52" r="11" fill="white" />
                    <motion.circle
                        cx="42"
                        cy="52"
                        r={5}
                        fill="#0F172A"
                        animate={{ scaleY: blinking || isCoveringEyes ? 0.1 : 1, x: targetEyeX, y: targetEyeY }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                    <circle cx="78" cy="52" r="11" fill="white" />
                    <motion.circle
                        cx="78"
                        cy="52"
                        r={5}
                        fill="#0F172A"
                        animate={{ scaleY: blinking || isCoveringEyes ? 0.1 : 1, x: targetEyeX, y: targetEyeY }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                </g>

                {/* BOCA */}
                {isSuccess ? (
                    <path d="M 44 68 Q 60 88 76 68" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
                ) : isError ? (
                    <path d="M 45 80 Q 60 66 75 80" fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
                ) : isCoveringEyes ? (
                    <path d="M 52 74 Q 60 70 68 74" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
                ) : isHidingPassword ? (
                    <motion.circle cx="60" cy="76" r="4" fill="none" stroke="white" strokeWidth="3" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
                ) : (
                    <path d="M 50 74 Q 60 78 70 74" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
                )}

                {/* MANITAS */}
                <motion.g animate={isCoveringEyes ? { x: 17, y: -32, rotate: 15 } : isHidingPassword ? { x: 10, y: -18, rotate: 22 } : { x: 0, y: 0, rotate: 0 }}>
                    <path d="M 12 84 C 12 77 17 73 24 73 C 27 73 29 74 31 76 C 33 74 36 74 38 76 C 40 78 40 81 39 84 C 38 87 35 93 27 94 C 18 94 12 90 12 84 Z" fill={isDannaExact ? "#EC4899" : isDannaSuspect ? "#A855F7" : "#FF3131"} />
                </motion.g>
                <motion.g animate={isCoveringEyes ? { x: -17, y: -32, rotate: -15 } : isHidingPassword ? { x: -10, y: -18, rotate: -22 } : { x: 0, y: 0, rotate: 0 }}>
                    <path d="M 108 84 C 108 77 103 73 96 73 C 93 73 91 74 89 76 C 87 74 84 74 82 76 C 80 78 80 81 81 84 C 82 87 85 93 93 94 C 102 94 108 90 108 84 Z" fill={isDannaExact ? "#EC4899" : isDannaSuspect ? "#A855F7" : "#FF3131"} />
                </motion.g>
            </svg>
        </div>
    );
}