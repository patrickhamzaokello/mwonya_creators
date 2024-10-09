import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ExternalLink, Music, Users, Calendar, NotebookPen,BadgeCheck } from 'lucide-react';
import { boolean, number } from 'zod';

interface ArtistProfileBannerProps {
    artistName: string;
    tagline: string;
    backgroundImageUrl: string;
    profileImageUrl: string;
    isVerified: boolean;
    followerCount: number;
    genre: string
}

const ArtistProfileBanner = ({
    artistName,
    tagline,
    backgroundImageUrl,
    profileImageUrl,
    isVerified = false,
    followerCount,
    genre,
}: ArtistProfileBannerProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative w-full h-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Parallax Background */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${backgroundImageUrl || '/api/placeholder/1200/400'})`,
                }}
                initial={{ scale: 1.1 }}
                animate={{ y: isHovered ? -10 : 0, scale: isHovered ? 1.15 : 1.1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            </motion.div>

            {/* Profile Image with Gallery Option */}
            <div
                className="absolute top-4 right-4 flex items-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative group">
                    <img
                        src={profileImageUrl || '/api/placeholder/120/120'}
                        alt={`${artistName}'s profile`}
                        className="w-40 h-40 border-2 border-inherit  transition-transform group-hover:scale-105 object-cover"
                    />
                    
                  
                </div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8">
                <div className="flex items-center mb-2">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold text-white font-custom"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {artistName}
                    </motion.h1>
                </div>
                <motion.p
                    className="text-xl text-gray-300 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {tagline}
                </motion.p>



                {/* Follow Button and Follower Count */}
                <div className="flex items-center mb-4 gap-4">
                  
                   

                    {/* Genre Tag */}
                    <motion.div
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                         {isVerified && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mr-2"
                        >
                            <BadgeCheck/>
                        </motion.div>
                    )}
                        Verified

                    </motion.div>

                    <motion.div
                        className="flex items-center text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Users className="mr-2" size={18} />
                        <span>{followerCount.toLocaleString()} followers</span>
                    </motion.div>

                    <motion.div
                        className="flex items-center text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <NotebookPen className="mr-2" size={18} />
                        <span>{genre} Genre</span>
                    </motion.div>

                    
                    
                </div>

        
                
            </div>

            {/* Decorative Element */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
        </motion.div>
    );
};

export default ArtistProfileBanner;