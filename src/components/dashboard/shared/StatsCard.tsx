import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string; // Tailwind gradient classes
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 hover:bg-card/80 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatsCard;
