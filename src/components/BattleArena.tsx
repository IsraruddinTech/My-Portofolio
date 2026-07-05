import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sound } from "../utils/sound";
import { POKEMON_DB, ENEMY_POKEMON_DB, getFrontSprite, getBackSprite } from "../data";
import { BattlePokemon, PokemonBase, BattleLog, Move } from "../types";
import { LogOut, Award, RefreshCw, Trophy, Zap, Shield, Heart } from "lucide-react";

interface BattleArenaProps {
  onBackToHome: () => void;
}

export default function BattleArena({ onBackToHome }: BattleArenaProps) {
  // Game views: "auth" | "select_team" | "battle"
  const [view, setView] = useState<"auth" | "select_team" | "battle">("auth");
  
  // Auth Form State
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  
  // Trainer Session
  const [trainerName, setTrainerName] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [stage, setStage] = useState(1);
  
  // Team Selection State (Max 3)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Battle Emulator State
  const [playerParty, setPlayerParty] = useState<BattlePokemon[]>([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState(0);
  const [opponent, setOpponent] = useState<BattlePokemon | null>(null);
  
  // Items quantity
  const [potions, setPotions] = useState(3);
  const [fullHeals, setFullHeals] = useState(1);
  const [pokeballs, setPokeballs] = useState(3);
  
  // Interaction/Animation States
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [activeTab, setActiveTab] = useState<"moves" | "items" | "party">("moves");
  const [playerAnim, setPlayerAnim] = useState<any>({});
  const [enemyAnim, setEnemyAnim] = useState<any>({});
  const [playerHitText, setPlayerHitText] = useState("");
  const [enemyHitText, setEnemyHitText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Active player Pokemon getter
  const activePlayer = playerParty[activePlayerIdx] || null;

  // Load Leaderboard on mount and auth
  useEffect(() => {
    fetchLeaderboard();
  }, [view]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (e) {
      console.error("Failed to load leaderboard");
    }
  };

  // Helper to append battle logs
  const logMessage = (text: string, type: "info" | "damage" | "heal" | "status" | "win" | "lose" = "info") => {
    setBattleLogs((prev) => [
      { id: Math.random().toString(), text, type },
      ...prev.slice(0, 20) // Keep last 20 logs
    ]);
  };

  // Account creation / Authentication
  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!username || !password) {
      setAuthError("Trainer name and secret password are required!");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setAuthError("Secret password confirmation does not match!");
      return;
    }

    const endpoint = isRegister ? "/api/users/register" : "/api/users/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.message || "Something went wrong. Try again!");
        return;
      }

      // Success
      sound.playLevelUp();
      setTrainerName(data.user.username);
      setWins(data.user.wins);
      setLosses(data.user.losses);
      setStage(data.user.stage);

      if (data.user.team && data.user.team.length > 0) {
        // Already has a team, populate battle state and go to battle
        const party: BattlePokemon[] = data.user.team.map((id: number) => {
          const base = POKEMON_DB.find((p) => p.id === id) || POKEMON_DB[0];
          return { ...base, currentHp: base.maxHp };
        });
        setPlayerParty(party);
        setActivePlayerIdx(0);
        generateOpponent(data.user.stage);
        setView("battle");
        logMessage(`Welcome back, Trainer ${data.user.username}! Prepared to battle?`, "info");
      } else {
        // Go to Team Select
        setView("select_team");
      }
    } catch (e) {
      setAuthError("Failed to connect to the Server. Try again later!");
    }
  };

  // Logout
  const handleLogout = () => {
    sound.playBeep();
    setTrainerName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setSelectedIds([]);
    setPlayerParty([]);
    setOpponent(null);
    setView("auth");
  };

  // Select team checkbox click
  const handlePokemonSelect = (id: number) => {
    sound.playBeep();
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return prev; // max 3
      }
      return [...prev, id];
    });
  };

  // Confirm Team and save
  const handleConfirmTeam = async () => {
    if (selectedIds.length !== 3) {
      sound.playFaint();
      alert("Please choose exactly 3 Pokémon for your team!");
      return;
    }

    sound.playLevelUp();

    // Map to BattlePokemon
    const party: BattlePokemon[] = selectedIds.map((id) => {
      const base = POKEMON_DB.find((p) => p.id === id) || POKEMON_DB[0];
      return { ...base, currentHp: base.maxHp };
    });

    setPlayerParty(party);
    setActivePlayerIdx(0);
    generateOpponent(stage);

    // Save team to server
    try {
      await fetch("/api/users/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trainerName,
          wins,
          losses,
          stage,
          team: selectedIds
        })
      });
    } catch (e) {
      console.error("Failed to save team to server");
    }

    setView("battle");
    setBattleLogs([]);
    logMessage("Your team is ready! Stage 1 battle is beginning...", "info");
  };

  // Opponent generation based on Stage Difficulty
  const generateOpponent = (currentStage: number) => {
    let base: PokemonBase;
    
    // Select wild pokemon pool
    if (currentStage >= 16) {
      // Legendary/Boss tier (Mewtwo, Charizard)
      const list = ENEMY_POKEMON_DB.filter(e => [150, 6].includes(e.id));
      base = list[Math.floor(Math.random() * list.length)];
    } else if (currentStage >= 11) {
      // High tier (Gengar, Snorlax)
      const list = ENEMY_POKEMON_DB.filter(e => [94, 143].includes(e.id));
      base = list[Math.floor(Math.random() * list.length)];
    } else if (currentStage >= 6) {
      // Mid tier (Starters from normal list)
      const list = POKEMON_DB.filter(p => [1, 4, 7, 25].includes(p.id));
      base = list[Math.floor(Math.random() * list.length)];
    } else {
      // Beginner tier (Pidgey, Rattata, Caterpie)
      const list = ENEMY_POKEMON_DB.filter(e => [16, 19, 10].includes(e.id));
      base = list[Math.floor(Math.random() * list.length)];
    }

    // Scale stats with stage level
    const levelScale = Math.min(5 + Math.floor(currentStage / 1.5), 50);
    const hpScale = base.maxHp + (levelScale - base.level) * 5;

    const scaledOpponent: BattlePokemon = {
      ...base,
      level: levelScale,
      maxHp: hpScale,
      currentHp: hpScale,
      attack: base.attack + (levelScale - base.level) * 2,
      defense: base.defense + (levelScale - base.level) * 2,
    };

    setOpponent(scaledOpponent);
    setEnemyHitText("");
    setPlayerHitText("");
  };

  // Sync game state to server
  const saveGameState = async (newWins = wins, newLosses = losses, newStage = stage) => {
    try {
      await fetch("/api/users/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trainerName,
          wins: newWins,
          losses: newLosses,
          stage: newStage,
          team: playerParty.map(p => p.id)
        })
      });
    } catch (e) {
      console.error("Save failure");
    }
  };

  // Player triggers move strike
  const handlePlayerMove = async (move: Move) => {
    if (isProcessing || !activePlayer || !opponent) return;
    setIsProcessing(true);

    // 1. PLAYER MOVE ACTION
    sound.playHit();
    setPlayerAnim({ x: [0, 40, 0], y: [0, -30, 0] }); // Lunge forward
    
    // Deduct damage / check healing
    if (move.power < 0) {
      // Healing move (negative power indicates recovery)
      const healAmount = Math.abs(move.power);
      const newHp = Math.min(activePlayer.maxHp, activePlayer.currentHp + healAmount);
      
      setPlayerParty((prev) => {
        const copy = [...prev];
        copy[activePlayerIdx].currentHp = newHp;
        return copy;
      });

      setPlayerHitText(`+${healAmount} HP`);
      logMessage(`${activePlayer.name} used ${move.name}! Restored ${healAmount} HP.`, "heal");
      
      setTimeout(() => setPlayerHitText(""), 1200);
    } else {
      // Standard damage attack
      const randMod = 0.85 + Math.random() * 0.3; // random between 0.85 and 1.15
      const damage = Math.max(8, Math.floor(((2 * activePlayer.level / 5 + 2) * move.power * (activePlayer.attack / opponent.defense) / 50 + 2) * randMod));
      
      const newEnemyHp = Math.max(0, opponent.currentHp - damage);
      setOpponent((prev) => prev ? { ...prev, currentHp: newEnemyHp } : null);
      
      // Opponent damaged flash
      setEnemyAnim({ x: [-5, 5, -5, 5, 0], opacity: [1, 0.4, 1, 0.4, 1] });
      setEnemyHitText(`-${damage} HP`);
      logMessage(`${activePlayer.name} used ${move.name}! Deals ${damage} damage to ${opponent.name}.`, "damage");

      setTimeout(() => setEnemyHitText(""), 1200);

      // Check if enemy fainted
      if (newEnemyHp <= 0) {
        setTimeout(() => {
          sound.playLevelUp();
          logMessage(`Opponent ${opponent.name} fainted! You win!`, "win");
          
          const updatedWins = wins + 1;
          const updatedStage = stage + 1;
          setWins(updatedWins);
          setStage(updatedStage);
          
          // Heal player party slightly as reward
          setPlayerParty((prev) => {
            return prev.map((p) => ({
              ...p,
              currentHp: Math.min(p.maxHp, p.currentHp + Math.floor(p.maxHp * 0.3))
            }));
          });

          saveGameState(updatedWins, losses, updatedStage);
          generateOpponent(updatedStage);
          setIsProcessing(false);
        }, 1500);
        return;
      }
    }

    // 2. OPPONENT COUNTER ATTACK (triggers after 1.2s delay)
    setTimeout(() => {
      if (!opponent || opponent.currentHp <= 0) return;

      sound.playHit();
      // Opponent moves
      setEnemyAnim({ x: [0, -40, 0], y: [0, 30, 0] }); // Enemy lunges
      
      const wildMove = opponent.moves[Math.floor(Math.random() * opponent.moves.length)];
      
      if (wildMove.power < 0) {
        // Opponent heals
        const healAmount = Math.abs(wildMove.power);
        const newOppHp = Math.min(opponent.maxHp, opponent.currentHp + healAmount);
        setOpponent((prev) => prev ? { ...prev, currentHp: newOppHp } : null);
        setEnemyHitText(`+${healAmount} HP`);
        logMessage(`${opponent.name} used ${wildMove.name}! Restored ${healAmount} HP.`, "heal");
        setTimeout(() => setEnemyHitText(""), 1200);
      } else {
        // Opponent damage
        const randMod = 0.85 + Math.random() * 0.3;
        const damage = Math.max(6, Math.floor(((2 * opponent.level / 5 + 2) * wildMove.power * (opponent.attack / activePlayer.defense) / 50 + 2) * randMod));
        
        const newPlayerHp = Math.max(0, activePlayer.currentHp - damage);
        
        setPlayerParty((prev) => {
          const copy = [...prev];
          copy[activePlayerIdx].currentHp = newPlayerHp;
          return copy;
        });

        // Player damaged flash
        setPlayerAnim({ x: [-5, 5, -5, 5, 0], opacity: [1, 0.4, 1, 0.4, 1] });
        setPlayerHitText(`-${damage} HP`);
        logMessage(`${opponent.name} used ${wildMove.name}! Deals ${damage} damage to ${activePlayer.name}.`, "damage");
        setTimeout(() => setPlayerHitText(""), 1200);

        // Check player fainted
        if (newPlayerHp <= 0) {
          setTimeout(() => {
            sound.playFaint();
            logMessage(`${activePlayer.name} fainted!`, "lose");
            
            // Check if any conscious remaining party pokemon
            const nextIdx = playerParty.findIndex((p, idx) => idx !== activePlayerIdx && p.currentHp > 0);
            
            if (nextIdx !== -1) {
              logMessage(`Switching to conscious Pokémon: ${playerParty[nextIdx].name}!`, "info");
              setActivePlayerIdx(nextIdx);
            } else {
              // ALL FAINTED - DEFEAT
              logMessage("Your entire team has fainted! Game Over for this Stage.", "lose");
              const updatedLosses = losses + 1;
              setLosses(updatedLosses);
              saveGameState(wins, updatedLosses, stage);
              
              // Full Heal party to let user restart easily
              setPlayerParty((prev) => prev.map((p) => ({ ...p, currentHp: p.maxHp })));
              setActivePlayerIdx(0);
              generateOpponent(stage);
            }
          }, 1500);
        }
      }

      setTimeout(() => {
        setIsProcessing(false);
      }, 1300);

    }, 1500);
  };

  // Handle Item actions
  const handleUseItem = (itemType: "potion" | "full_heal" | "pokeball") => {
    if (isProcessing || !activePlayer || !opponent) return;

    if (itemType === "potion") {
      if (potions <= 0) {
        alert("Out of Potions!");
        return;
      }
      setIsProcessing(true);
      sound.playHeal();
      setPotions(prev => prev - 1);
      
      const healAmount = 40;
      const newHp = Math.min(activePlayer.maxHp, activePlayer.currentHp + healAmount);
      
      setPlayerParty((prev) => {
        const copy = [...prev];
        copy[activePlayerIdx].currentHp = newHp;
        return copy;
      });

      setPlayerHitText(`+${healAmount} HP`);
      logMessage(`Used Potion! Restored ${healAmount} HP to ${activePlayer.name}.`, "heal");
      setTimeout(() => setPlayerHitText(""), 1200);

      // Opponent turns to attack
      setTimeout(() => {
        setIsProcessing(false);
        handleOpponentTurnAfterItem();
      }, 1500);
    } 
    else if (itemType === "full_heal") {
      if (fullHeals <= 0) {
        alert("Out of Full Heals!");
        return;
      }
      setIsProcessing(true);
      sound.playHeal();
      setFullHeals(prev => prev - 1);
      
      setPlayerParty((prev) => {
        const copy = [...prev];
        copy[activePlayerIdx].currentHp = activePlayer.maxHp;
        return copy;
      });

      setPlayerHitText(`MAX HP`);
      logMessage(`Used Full Heal! Fully restored ${activePlayer.name}'s HP.`, "heal");
      setTimeout(() => setPlayerHitText(""), 1200);

      setTimeout(() => {
        setIsProcessing(false);
        handleOpponentTurnAfterItem();
      }, 1500);
    } 
    else if (itemType === "pokeball") {
      if (pokeballs <= 0) {
        alert("Out of PokeBalls!");
        return;
      }
      setIsProcessing(true);
      setPokeballs(prev => prev - 1);
      logMessage(`Threw a Pokéball at wild ${opponent.name}!`, "info");

      // Shake animation on opponent
      setEnemyAnim({ rotate: [0, -15, 15, -15, 15, 0], scale: [1, 0.8, 1, 0.8, 1] });
      
      // Calculate capture rate based on HP ratio
      const hpRatio = opponent.currentHp / opponent.maxHp;
      const successChance = hpRatio <= 0.35 ? 0.85 : hpRatio <= 0.6 ? 0.5 : 0.2;

      setTimeout(() => {
        if (Math.random() <= successChance) {
          // CAPTURED SUCCESS
          sound.playLevelUp();
          logMessage(`Gotcha! ${opponent.name} was successfully captured!`, "win");
          
          // Add opponent to player options/party if not already there, healing them
          setPlayerParty((prev) => {
            if (prev.length < 6) {
              return [...prev, { ...opponent, currentHp: opponent.maxHp }];
            }
            return prev;
          });

          const updatedWins = wins + 1;
          const updatedStage = stage + 1;
          setWins(updatedWins);
          setStage(updatedStage);
          saveGameState(updatedWins, losses, updatedStage);
          generateOpponent(updatedStage);
          setIsProcessing(false);
        } else {
          // ESCAPED
          sound.playFaint();
          logMessage(`Oh no! Wild ${opponent.name} broke free!`, "info");
          setTimeout(() => {
            setIsProcessing(false);
            handleOpponentTurnAfterItem();
          }, 1000);
        }
      }, 1800);
    }
  };

  // Helper opponent strike after user utilizes an item
  const handleOpponentTurnAfterItem = () => {
    if (!opponent || opponent.currentHp <= 0 || !activePlayer) return;
    setIsProcessing(true);

    sound.playHit();
    setEnemyAnim({ x: [0, -40, 0], y: [0, 30, 0] }); // Enemy attacks

    const wildMove = opponent.moves[Math.floor(Math.random() * opponent.moves.length)];
    const randMod = 0.85 + Math.random() * 0.3;
    const damage = Math.max(6, Math.floor(((2 * opponent.level / 5 + 2) * wildMove.power * (opponent.attack / activePlayer.defense) / 50 + 2) * randMod));
    
    const newPlayerHp = Math.max(0, activePlayer.currentHp - damage);
    
    setPlayerParty((prev) => {
      const copy = [...prev];
      copy[activePlayerIdx].currentHp = newPlayerHp;
      return copy;
    });

    setPlayerAnim({ x: [-5, 5, -5, 5, 0], opacity: [1, 0.4, 1, 0.4, 1] });
    setPlayerHitText(`-${damage} HP`);
    logMessage(`${opponent.name} used counter ${wildMove.name}! Deals ${damage} damage to ${activePlayer.name}.`, "damage");
    setTimeout(() => setPlayerHitText(""), 1200);

    setTimeout(() => {
      setIsProcessing(false);
    }, 1300);
  };

  // Switch Active party pokemon
  const handleSwitchParty = (idx: number) => {
    if (isProcessing || idx === activePlayerIdx) return;
    if (playerParty[idx].currentHp <= 0) {
      alert("Cannot switch to a fainted Pokémon!");
      return;
    }

    setIsProcessing(true);
    sound.playBeep();
    setActivePlayerIdx(idx);
    logMessage(`Go! ${playerParty[idx].name}!`, "info");

    // Switch takes a turn, opponent attacks instantly
    setTimeout(() => {
      setIsProcessing(false);
      handleOpponentTurnAfterItem();
    }, 1200);
  };

  // GameShark Cheat Code: Stage skip
  const triggerCheat = () => {
    sound.playLevelUp();
    
    // Level up party pokemon
    setPlayerParty((prev) => {
      return prev.map(p => ({
        ...p,
        level: p.level + 2,
        maxHp: p.maxHp + 10,
        currentHp: p.maxHp + 10,
        attack: p.attack + 4,
        defense: p.defense + 4
      }));
    });

    // Advance Stage
    const nextStage = stage + 1;
    setStage(nextStage);
    setWins(wins + 1);
    saveGameState(wins + 1, losses, nextStage);
    generateOpponent(nextStage);
    
    logMessage(`GameShark code accepted! Party leveled up & skipped to Stage ${nextStage}!`, "win");
  };

  // Reset Game completely
  const triggerResetGame = () => {
    if (confirm("Reset wins/losses and start back at Stage 1? Your accounts remains intact.")) {
      sound.playBeep();
      setStage(1);
      setWins(0);
      setLosses(0);
      setPlayerParty((prev) => prev.map(p => ({ ...p, currentHp: p.maxHp })));
      setActivePlayerIdx(0);
      generateOpponent(1);
      saveGameState(0, 0, 1);
      logMessage("Game progress reset to Stage 1.", "info");
    }
  };

  return (
    <div className="py-10 bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-white min-h-[calc(100vh-4.5rem)] font-mono select-none px-4 transition-colors duration-300">
      {/* scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%)] dark:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] z-10" />

      {/* VIEW 1: REGISTRATION / LOGIN AUTH (CRT TERMINAL FORM) */}
      {view === "auth" && (
        <div className="max-w-md mx-auto my-8 border-4 border-black dark:border-slate-600 bg-white dark:bg-[#1e293b] shadow-[6px_6px_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_rgba(255,255,255,0.15)] p-6 relative transition-all">
          <div className="absolute top-2 left-2 flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          
          <div className="text-center space-y-4 pt-4">
            <div className="text-3xl font-black text-amber-400 tracking-widest drop-shadow-[0_2px_0_rgba(0,0,0,1)] uppercase">
              POKEMON BATTLE
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Choose your path, Trainer
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { sound.playBeep(); setIsRegister(true); setAuthError(""); }}
                className={`py-3.5 border-4 border-black text-xs font-black tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                  isRegister ? "bg-[#16a34a] text-white shadow-none translate-x-0.5 translate-y-0.5" : "bg-[#f1f5f9] dark:bg-slate-800 text-black dark:text-white shadow-[3px_3px_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_rgba(255,255,255,0.15)] hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                🆕 NEW TRAINER
              </button>
              <button
                onClick={() => { sound.playBeep(); setIsRegister(false); setAuthError(""); }}
                className={`py-3.5 border-4 border-black text-xs font-black tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                  !isRegister ? "bg-[#2563eb] text-white shadow-none translate-x-0.5 translate-y-0.5" : "bg-[#f1f5f9] dark:bg-slate-800 text-black dark:text-white shadow-[3px_3px_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_rgba(255,255,255,0.15)] hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                🔄 CONTINUE
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 pt-4">
              {/* Username */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Trainer Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f172a] border-2 border-black dark:border-slate-600 focus:border-amber-400 focus:outline-none text-xs font-bold text-black dark:text-white tracking-wide transition-colors"
                />
                {isRegister && (
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-none">3-20 characters, letters/numbers/underscore only</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Secret Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f172a] border-2 border-black dark:border-slate-600 focus:border-amber-400 focus:outline-none text-xs font-bold text-black dark:text-white tracking-wide transition-colors"
                />
                {isRegister && (
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-none">Minimum 6 characters</p>
                )}
              </div>

              {/* Confirm Password (Register only) */}
              {isRegister && (
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Confirm Password</label>
                  <input
                    type="password"
                    required={isRegister}
                    placeholder="Confirm password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f172a] border-2 border-black dark:border-slate-600 focus:border-amber-400 focus:outline-none text-xs font-bold text-black dark:text-white tracking-wide transition-colors"
                  />
                </div>
              )}

              {/* Error block */}
              {authError && (
                <div className="p-3 bg-red-950/50 border-2 border-red-500 text-red-400 text-xs text-left font-bold animate-pulse">
                  ⚠️ {authError}
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="px-4 py-3.5 border-4 border-black bg-slate-700 text-white font-black text-xs tracking-wider uppercase hover:bg-slate-600 cursor-pointer select-none"
                >
                  ← BACK
                </button>
                <button
                  type="submit"
                  className="flex-1 text-center py-3.5 border-4 border-black bg-amber-400 text-black font-black text-xs tracking-widest uppercase hover:bg-amber-300 shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer select-none"
                >
                  {isRegister ? "✓ CREATE ACCOUNT" : "✓ LOGIN"}
                </button>
              </div>
            </form>
          </div>

          {/* Mini scoreboard/Leaderboard overview */}
          <div className="mt-8 border-t-4 border-black dark:border-slate-600 pt-5 text-left">
            <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 tracking-wider mb-3 flex items-center gap-1.5 uppercase">
              <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              TOP TRAINERS LEADERBOARD
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {leaderboard.length === 0 ? (
                <p className="text-[10px] text-slate-500 dark:text-slate-400">No trainers registered yet. Be the first!</p>
              ) : (
                leaderboard.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-bold bg-slate-100 dark:bg-slate-800 p-2 border border-black/15 dark:border-slate-700">
                    <span className="text-slate-800 dark:text-slate-200">
                      #{idx + 1} {item.username}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400">
                      Stage {item.stage} ({item.wins} Wins)
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TEAM SELECT STAGE */}
      {view === "select_team" && (
        <div className="max-w-2xl mx-auto my-8 border-4 border-black dark:border-slate-600 bg-white dark:bg-[#1e293b] p-6 shadow-[6px_6px_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_rgba(255,255,255,0.15)] text-left transition-colors duration-300">
          <div className="space-y-2 border-b-4 border-black dark:border-slate-600 pb-4">
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 tracking-wider uppercase bg-amber-50 dark:bg-amber-950/40 border border-amber-600 dark:border-amber-500 px-2 py-0.5">
              STAGE {stage} / 30
            </span>
            <h2 className="text-2xl font-black text-black dark:text-white tracking-widest uppercase transition-colors">
              BUILD YOUR TEAM
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
              CHOOSE EXACTLY 3 POKÉMON — <span className="text-amber-600 dark:text-amber-400">{selectedIds.length}/3 SELECTED</span>
            </p>
          </div>

          {/* Grid selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
            {POKEMON_DB.map((poke) => {
              const isSelected = selectedIds.includes(poke.id);
              return (
                <div
                  key={poke.id}
                  onClick={() => handlePokemonSelect(poke.id)}
                  className={`border-4 p-4 flex flex-col items-center justify-between cursor-pointer select-none relative transition-all ${
                    isSelected 
                      ? "border-amber-400 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/20 shadow-[3px_3px_0_rgba(251,191,36,0.5)]" 
                      : "border-black dark:border-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-[3px_3px_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_rgba(255,255,255,0.15)]"
                  }`}
                >
                  <img
                    src={getFrontSprite(poke.id)}
                    alt={poke.name}
                    className="w-18 h-18 object-contain image-render-pixelated"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center mt-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-slate-100 transition-colors">{poke.name}</h3>
                    <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                      {poke.type}
                    </span>
                  </div>

                  {/* HP and Level labels */}
                  <div className="mt-2.5 flex gap-2 text-[8.5px] font-mono text-slate-700 dark:text-slate-300">
                    <span>HP: {poke.maxHp}</span>
                    <span>LV: {poke.level}</span>
                  </div>

                  {/* Active Indicator checkdot */}
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-black dark:border-white ${
                    isSelected ? "bg-amber-400" : "bg-transparent"
                  }`} />
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 border-t-4 border-black dark:border-slate-600 pt-5">
            <button
              onClick={handleLogout}
              className="px-5 py-3 border-4 border-black bg-slate-700 hover:bg-slate-600 text-white font-black text-xs tracking-wider uppercase cursor-pointer"
            >
              LOGOUT
            </button>
            <button
              onClick={handleConfirmTeam}
              className="flex-1 text-center py-3.5 border-4 border-black bg-amber-400 text-black font-black text-xs tracking-wider uppercase hover:bg-amber-300 shadow-[3px_3px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              ✓ CONFIRM TEAM & ENTER BATTLE
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: ACTIVE BATTLE SIMULATOR */}
      {view === "battle" && activePlayer && opponent && (
        <div className="max-w-4xl mx-auto border-4 border-black dark:border-white bg-white dark:bg-[#1e293b] shadow-[8px_8px_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.15)] overflow-hidden relative transition-colors duration-300">
          
          {/* TOP STATUS BAR CONTAINER */}
          <div className="bg-slate-100 dark:bg-[#0f172a] border-b-4 border-black dark:border-b-white p-3.5 flex flex-wrap items-center justify-between gap-3 text-left transition-colors duration-300">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-black border-2 border-black shadow-[1.5px_1.5px_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 cursor-pointer uppercase"
              >
                <LogOut className="w-3 h-3 inline-block mr-1" />
                LOGOUT
              </button>
              <div>
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-600 dark:border-amber-500 px-2 py-0.5 uppercase tracking-wider leading-none">
                  Trainer: {trainerName}
                </span>
                <p className="text-[9px] text-slate-600 dark:text-slate-400 leading-none mt-1 font-bold">
                  STAGE {stage} / 30
                </p>
              </div>
            </div>

            {/* Score info */}
            <div className="flex gap-4 text-[10px] font-mono font-bold">
              <span className="text-green-600 dark:text-green-400">WIN: {wins}</span>
              <span className="text-rose-600 dark:text-rose-400">LOSS: {losses}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={triggerCheat}
                title="Level up & skip current Stage (Cheat Code)"
                className="px-2.5 py-1 bg-purple-600 text-white border-2 border-black text-[9px] font-black hover:bg-purple-500 cursor-pointer shadow-[1.5px_1.5px_0_rgba(0,0,0,1)]"
              >
                GAME SHARK / CHEAT
              </button>
              <button
                onClick={triggerResetGame}
                title="Reset progress completely"
                className="px-2.5 py-1 bg-slate-700 text-white border-2 border-black text-[9px] font-black hover:bg-slate-600 cursor-pointer shadow-[1.5px_1.5px_0_rgba(0,0,0,1)]"
              >
                <RefreshCw className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* BATTLE arena SCREEN WINDOW */}
          <div className="relative h-64 sm:h-80 bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-400 overflow-hidden flex flex-col justify-between p-4">
            
            {/* Scanlines overlay on monitor */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

            {/* Retro scenery clouds */}
            <div className="absolute top-6 left-12 w-14 h-5 bg-white/70 rounded-full blur-[1px] animate-pulse" />
            <div className="absolute top-10 right-16 w-20 h-6 bg-white/70 rounded-full blur-[1px] animate-pulse" />

            {/* ENEMY HP BOX (Top Right) */}
            <div className="self-end w-48 sm:w-56 bg-[#f8fafc]/95 border-4 border-black p-2 text-black shadow-[3px_3px_0_rgba(0,0,0,0.8)] z-20">
              <div className="flex justify-between items-baseline font-black">
                <span className="text-xs uppercase tracking-wide">{opponent.name}</span>
                <span className="text-[10px] text-slate-500">Lv.{opponent.level}</span>
              </div>
              
              {/* HP Bar */}
              <div className="mt-1.5 h-3 bg-slate-200 border-2 border-black p-[1.5px] rounded-none">
                <div 
                  className={`h-full transition-all duration-300 ${
                    opponent.currentHp / opponent.maxHp > 0.5 
                      ? "bg-green-500" 
                      : opponent.currentHp / opponent.maxHp > 0.25 
                      ? "bg-yellow-500" 
                      : "bg-red-500"
                  }`}
                  style={{ width: `${(opponent.currentHp / opponent.maxHp) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-1 text-[8px] font-mono font-bold text-slate-600">
                <span className="uppercase tracking-widest text-[#ef4444]">{opponent.type}</span>
                <span>{opponent.currentHp}/{opponent.maxHp} HP</span>
              </div>
            </div>

            {/* ENEMY SPRITE (Top Right / Middle-Right Grass Platform) */}
            <div className="absolute right-12 top-20 sm:top-24 z-10 flex flex-col items-center">
              {/* Floating hit indicators */}
              <AnimatePresence>
                {enemyHitText && (
                  <motion.div 
                    initial={{ y: 0, opacity: 0, scale: 0.5 }}
                    animate={{ y: -30, opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-30 font-black text-red-600 text-sm md:text-md drop-shadow-[0_1.5px_0_rgba(255,255,255,1)]"
                  >
                    {enemyHitText}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.img
                animate={enemyAnim}
                transition={{ duration: 0.3 }}
                src={getFrontSprite(opponent.id, opponent.name)}
                alt={opponent.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain image-render-pixelated"
                referrerPolicy="no-referrer"
              />
              
              {/* Grass stand platform */}
              <div className="w-24 h-4 bg-emerald-600/40 rounded-full filter blur-[2px] -mt-2" />
            </div>

            {/* PLAYER HP BOX (Bottom Left) */}
            <div className="self-start w-48 sm:w-56 bg-[#f8fafc]/95 border-4 border-black p-2 text-black shadow-[3px_3px_0_rgba(0,0,0,0.8)] z-20 mt-auto">
              <div className="flex justify-between items-baseline font-black">
                <span className="text-xs uppercase tracking-wide">{activePlayer.name}</span>
                <span className="text-[10px] text-slate-500">Lv.{activePlayer.level}</span>
              </div>

              {/* HP Bar */}
              <div className="mt-1.5 h-3 bg-slate-200 border-2 border-black p-[1.5px] rounded-none">
                <div 
                  className={`h-full transition-all duration-300 ${
                    activePlayer.currentHp / activePlayer.maxHp > 0.5 
                      ? "bg-green-500" 
                      : activePlayer.currentHp / activePlayer.maxHp > 0.25 
                      ? "bg-yellow-500" 
                      : "bg-red-500"
                  }`}
                  style={{ width: `${(activePlayer.currentHp / activePlayer.maxHp) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-1 text-[8px] font-mono font-bold text-slate-600">
                <span className="uppercase tracking-widest text-[#ef4444]">{activePlayer.type}</span>
                <span>{activePlayer.currentHp}/{activePlayer.maxHp} HP</span>
              </div>
            </div>

            {/* PLAYER BACK SPRITE (Bottom Left Grass Platform) */}
            <div className="absolute left-10 bottom-4 sm:bottom-6 z-10 flex flex-col items-center">
              {/* Floating hit indicators */}
              <AnimatePresence>
                {playerHitText && (
                  <motion.div 
                    initial={{ y: 0, opacity: 0, scale: 0.5 }}
                    animate={{ y: -30, opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-30 font-black text-amber-500 text-sm md:text-md drop-shadow-[0_1.5px_0_rgba(0,0,0,1)]"
                  >
                    {playerHitText}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.img
                animate={playerAnim}
                transition={{ duration: 0.3 }}
                src={getBackSprite(activePlayer.id)}
                alt={activePlayer.name}
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain image-render-pixelated"
                referrerPolicy="no-referrer"
              />
              
              {/* Grass platform */}
              <div className="w-24 h-4 bg-emerald-600/40 rounded-full filter blur-[2px] -mt-1" />
            </div>

          </div>

          {/* LOWER CONTROLS PANEL GRID (Dialogue & Action Tabs) */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-t-4 border-black dark:border-white bg-white dark:bg-slate-800 text-black dark:text-white text-left transition-colors duration-300">
            
            {/* Left Block: Scrolling Battle Log Message Box (5 columns) */}
            <div className="md:col-span-5 border-b-4 md:border-b-0 md:border-r-4 border-black dark:border-white p-4 bg-slate-50 dark:bg-slate-900/60 flex flex-col h-44 md:h-auto transition-colors">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-wider mb-2 uppercase leading-none block">
                ● BATTLE LOGS
              </span>
              <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-bold font-mono pr-1 flex flex-col-reverse">
                {battleLogs.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500">Battle has begun! Choose your move Trainer.</p>
                ) : (
                  battleLogs.map((log) => {
                    let style = "text-slate-800 dark:text-slate-200";
                    if (log.type === "damage") style = "text-[#ef4444] dark:text-red-400";
                    if (log.type === "heal") style = "text-green-600 dark:text-green-400";
                    if (log.type === "win") style = "text-blue-600 dark:text-blue-400 font-extrabold";
                    if (log.type === "lose") style = "text-rose-600 dark:text-rose-400 font-extrabold";
                    
                    return (
                      <p key={log.id} className={`${style} leading-relaxed`}>
                        {log.text}
                      </p>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Block: Action Controls Interface tabs (7 columns) */}
            <div className="md:col-span-7 flex flex-col justify-between">
              
              {/* Interactive Tabs */}
              <div className="grid grid-cols-3 border-b-4 border-black dark:border-white bg-[#f1f5f9] dark:bg-slate-900 text-xs font-black transition-colors">
                <button
                  onClick={() => { sound.playBeep(); setActiveTab("moves"); }}
                  className={`py-3 text-center cursor-pointer border-r-2 border-black dark:border-white tracking-wider uppercase transition-colors ${
                    activeTab === "moves" ? "bg-white text-black dark:bg-slate-800 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  ⚔️ MOVES
                </button>
                <button
                  onClick={() => { sound.playBeep(); setActiveTab("items"); }}
                  className={`py-3 text-center cursor-pointer border-r-2 border-black dark:border-white tracking-wider uppercase transition-colors ${
                    activeTab === "items" ? "bg-white text-black dark:bg-slate-800 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  🎒 ITEMS
                </button>
                <button
                  onClick={() => { sound.playBeep(); setActiveTab("party"); }}
                  className={`py-3 text-center cursor-pointer tracking-wider uppercase transition-colors ${
                    activeTab === "party" ? "bg-white text-black dark:bg-slate-800 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  🛡️ PARTY
                </button>
              </div>

              {/* Tab Panel contents */}
              <div className="p-4 flex-1 min-h-[140px] flex items-center justify-center bg-white dark:bg-slate-800 transition-colors duration-300">
                
                {/* MOVES PANEL */}
                {activeTab === "moves" && (
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {activePlayer.moves.map((move, idx) => (
                      <button
                        key={idx}
                        disabled={isProcessing}
                        onClick={() => handlePlayerMove(move)}
                        className="py-3 px-4 border-4 border-black dark:border-slate-600 bg-[#fafafa] dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-amber-950 text-[10px] font-black tracking-wider uppercase flex flex-col items-start justify-center text-left relative overflow-hidden group shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 text-black dark:text-white"
                      >
                        <div className="flex justify-between items-baseline w-full">
                          <span className="text-black dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{move.name}</span>
                          <span className="text-[8px] text-slate-400 dark:text-slate-500">Power: {Math.abs(move.power)}</span>
                        </div>
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase mt-0.5 tracking-widest">{move.type}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* ITEMS PANEL */}
                {activeTab === "items" && (
                  <div className="grid grid-cols-3 gap-3 w-full">
                    {/* Potion */}
                    <button
                      disabled={isProcessing || potions <= 0}
                      onClick={() => handleUseItem("potion")}
                      className="p-3 border-4 border-black dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-[10px] font-black flex flex-col items-center justify-center shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50 text-black dark:text-white"
                    >
                      <Heart className="w-5 h-5 text-rose-500 animate-pulse mb-1" />
                      <span className="uppercase">POTION</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">QTY: {potions}</span>
                    </button>

                    {/* Full Heal */}
                    <button
                      disabled={isProcessing || fullHeals <= 0}
                      onClick={() => handleUseItem("full_heal")}
                      className="p-3 border-4 border-black dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-[10px] font-black flex flex-col items-center justify-center shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50 text-black dark:text-white"
                    >
                      <Shield className="w-5 h-5 text-blue-500 mb-1" />
                      <span className="uppercase">FULL HEAL</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">QTY: {fullHeals}</span>
                    </button>

                    {/* PokeBall */}
                    <button
                      disabled={isProcessing || pokeballs <= 0}
                      onClick={() => handleUseItem("pokeball")}
                      className="p-3 border-4 border-black dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-[10px] font-black flex flex-col items-center justify-center shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50 text-black dark:text-white"
                    >
                      <img 
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                        alt="Pokeball" 
                        className="w-6 h-6 image-render-pixelated mb-1"
                        referrerPolicy="no-referrer"
                      />
                      <span className="uppercase">POKÉBALL</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">QTY: {pokeballs}</span>
                    </button>
                  </div>
                )}

                {/* PARTY PANEL */}
                {activeTab === "party" && (
                  <div className="grid grid-cols-3 gap-3 w-full">
                    {playerParty.map((poke, idx) => {
                      const isActive = idx === activePlayerIdx;
                      const isFainted = poke.currentHp <= 0;
                      return (
                        <button
                          key={idx}
                          disabled={isProcessing || isActive || isFainted}
                          onClick={() => handleSwitchParty(idx)}
                          className={`p-2.5 border-4 border-black dark:border-slate-600 flex flex-col items-center justify-center shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] relative cursor-pointer disabled:opacity-50 text-black dark:text-white transition-colors ${
                            isActive 
                              ? "bg-amber-400 text-black border-amber-400 shadow-none translate-x-0.5 translate-y-0.5" 
                              : isFainted 
                              ? "bg-red-950/20 text-red-500 opacity-60" 
                              : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700"
                          }`}
                        >
                          <img
                            src={getFrontSprite(poke.id)}
                            alt={poke.name}
                            className="w-10 h-10 object-contain image-render-pixelated"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[9px] font-black uppercase mt-1 leading-none">{poke.name}</span>
                          <span className="text-[8px] text-slate-400 mt-1 leading-none">
                            {poke.currentHp}/{poke.maxHp} HP
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

      {/* FOOTER CAPTION */}
      <div className="mt-8 text-center text-slate-500 text-[10px] tracking-widest font-mono font-semibold uppercase">
        ⚡ RETRO GAMEBOY SIMULATION DESIGN FOR ISRARUDDIN ⚡
      </div>
    </div>
  );
}
