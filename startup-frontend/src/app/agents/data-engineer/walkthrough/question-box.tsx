import { motion } from "framer-motion";
import { Check, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hammer, FlaskConical } from "lucide-react";

interface QuestionBoxProps {
  title: string;
  isCompleted: boolean;
  onClick: () => void;
  className?: string;
}
{/* <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={isCompleted ? { 
        rotate: 360,
        transition: {
          duration: 4,
          ease: "linear",
          repeat: Infinity
        }
      } : {}}
    > */}
export function QuestionBox({ title, isCompleted, onClick, className }: QuestionBoxProps) {
  const box = {
    width: 100,
    height: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    transformOrigin: "center center"
  }
  return (
    <div className="flex items-center justify-center relative z-10">
      
        <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ transformOrigin: "center center" }}
        animate={isCompleted ? { 
          rotate: 360,
          transition: {
            duration: 2,
            ease: "linear",
            repeat: Infinity
          }
        }
          : {}}
        
      >
        <Button
          variant="outline"
          className={`p-6 ${title !== "Data Output" && "my-16"} flex flex-col ${isCompleted ? "bg-blue-700 hover:bg-blue-600 w-32 h-32" : "bg-black hover:bg-zinc-800 w-64 h-64"} items-center justify-center space-y-4 border-2 transition-all duration-300 ${className}`}
          onClick={onClick}
        >
          <div className="flex w-1/4 h-1/4 rounded-full p-4 items-center justify-center bg-white relative">
            {title === "Data Ingestion" && <Hammer className="w-3/4 h-3/4 text-black" />}
            {title === "Testing" && <FlaskConical className="w-3/4 h-3/4 text-black" />}
            {title === "Data Output" && <Cog className="w-3/4 h-3/4 text-black" />}
          </div>
        </Button>
      </motion.div>
    </div>
  );
}
{/* <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ transformOrigin: "center center" }}
        animate={isCompleted ? { 
          rotate: 360,
          transition: {
            duration: 10,
            ease: "linear",
            repeat: Infinity
          }
        }
          : {}}
        
      >  */}
      {/* <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ transformOrigin: "center center" }}
            animate={isCompleted ? {
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"],
            } : {}}
            transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 0.3,
            }}
        > */}