import React from 'react';
import { CreditCard, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const RevenueCard: React.FC = () => (
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
                    <div>
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

export default RevenueCard;