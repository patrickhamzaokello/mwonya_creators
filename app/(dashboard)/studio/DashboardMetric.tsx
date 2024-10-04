import React from 'react';
import { Users, Disc, Briefcase, DollarSign, CreditCard, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import ArtistPerformanceChart from './ArtistPerformanceChart';
import Image from "next/image";

interface MetricCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value }) => (
    <div className="relative border border-transparent bg-white shadow-sm rounded-lg p-6 overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-purple-500">
        <div className="flex items-center justify-between mb-4">
            {/* Icon with a rounded background */}
            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-purple-100 transition-all duration-300">
                <Icon className="w-6 h-6 text-purple-400 group-hover:text-purple-500 transition-colors duration-300" />
            </div>
            {/* Label */}
            <div className="text-sm uppercase tracking-wider text-gray-500 group-hover:text-gray-700 transition-all duration-300">
                {label}
            </div>
        </div>
        {/* Value with bolder and larger text */}
        <div className="text-3xl font-extrabold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
            {value}
        </div>
        {/* Subtle background decoration */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-gray-50 rounded-full group-hover:bg-purple-50 transition-all duration-300"></div>
    </div>
);


const RevenueCard = () => (
    <div className="col-span-2 relative overflow-hidden">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg transform transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 z-0"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <CreditCard className="w-10 h-10 text-purple-400" />
                    <div className="text-xl font-bold text-white">Revenue Card</div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">$124,500</div>
                <div className="text-sm text-gray-400">Total Revenue</div>
                <div className="mt-6 flex justify-between items-center">
                    <div >
                        <Link
                            href="#withdraw"
                            className="block w-full bg-gray-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center"
                        >
                            Withdraw <ArrowUpRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                    <div className="flex space-x-1 items-center justify-center">
                        <div className="text-xs text-gray-400 mr-4">01/25</div>

                        <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-600"></div>
                        <div className="w-4 h-4 rounded-full bg-white border border-white-500"></div>


                    </div>
                </div>

            </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-white opacity-10 z-20 pointer-events-none"></div>
    </div>
);

const DashboardLayout = () => {
    return (
        <div className="my-4 dark">
            <div className="flex">
                

                {/* Empty space for future content (2/3 width) */}
                <div className="w-2/3 bg-white-100 rounded-lg">
                    <div className="relative h-[300px] overflow-hidden mb-2 rounded-lg dark">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src="https://assets.mwonya.com/RawFiles/DTR.jpg"
                                alt="Artist Background"
                                width={0}
                                height={0}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

                        {/* Content */}
                        <div className="relative h-full flex items-center">
                            <div className="w-1/2 p-8">
                                <h1 className="text-6xl font-bold text-gray-800 z-10 relative mb-2">Drillz The Rapper</h1>
                                <p className="text-2xl text-gray-500 z-10 relative">I am here to spread positivity</p>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
                        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
                {/* Metrics Section (1/3 width) */}
                <div className="w-1/3 pr-4">
                    <div className="grid grid-cols-2 gap-4">

                        <RevenueCard />
                     
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;