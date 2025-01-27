import React from 'react';
import { LineChart, BarChart, ArrowUpRight, Users, Music, DollarSign, TrendingUp } from 'lucide-react';
import { RevenueSourceChat } from './revenue_source';
import { RevenueMonthlyChart } from './revenue_monthly';

// Mock data - in a real app this would come from an API
const revenueData = {
  totalRevenue: 124350,
  streamingRevenue: 84200,
  membershipRevenue: 40150,
  streamingGrowth: 12.5,
  membershipGrowth: 8.3,
  activeMembers: 1250,
  monthlyStreams: 524890
};

function StatCard({ title, value, icon: Icon, trend, className = '' }) {
  return (
    <div className={`border bg-card text-card-foreground shadow rounded-xl p-6${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-background rounded-lg">
          <Icon className="w-6 h-6 text-white-600" />
        </div>
        {trend && (
          <span className="flex items-center text-sm text-green-600 bg-background px-2 py-1 rounded-full">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            {trend}%
          </span>
        )}
      </div>
      <h3 className="text-sm text-gray-600 font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1 text-white-900">{value}</p>
    </div>
  );
}

function App() {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
            <p className=" mt-1">Track your streaming and circle membership earnings</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=50&h=50"
            alt="Artist"
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(revenueData.totalRevenue)}
            icon={DollarSign}
            trend={10.4}
          />
          <StatCard
            title="Streaming Revenue"
            value={formatCurrency(revenueData.streamingRevenue)}
            icon={Music}
            trend={revenueData.streamingGrowth}
          />
          <StatCard
            title="Membership Revenue"
            value={formatCurrency(revenueData.membershipRevenue)}
            icon={Users}
            trend={revenueData.membershipGrowth}
          />
          <StatCard
            title="Monthly Streams"
            value={formatNumber(revenueData.monthlyStreams)}
            icon={TrendingUp}
          />
          <StatCard
            title="Monthly Streams"
            value={formatNumber(revenueData.activeMembers)}
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueMonthlyChart />

          <RevenueSourceChat />
        </div>
      </div>
    </div>
  );
}

export default App;