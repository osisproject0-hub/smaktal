"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Binary,
  HeartPulse,
  Bot,
  Swords,
  Book,
  Shield,
} from 'lucide-react';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { motion } from 'framer-motion';
import { doc } from 'firebase/firestore';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/skill-tree', label: 'Pohon Keahlian', icon: Binary },
  { href: '/dashboard/well-being', label: 'Kesejahteraan', icon: HeartPulse },
  { href: '/dashboard/ai-tutor', label: 'AI Tutor', icon: Bot },
];

const adminItems = [
  { href: '/dashboard/admin', label: 'Admin', icon: Shield, role: 'admin' },
];

const otherItems = [
  { href: '#', label: 'Kolaborasi', icon: Swords, disabled: true },
  { href: '#', label: 'Mata Pelajaran', icon: Book, disabled: true },
]

export function SidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userData } = useDoc(userDocRef);
  const userRole = userData?.role;

  const renderLink = (item: any) => {
    const isActive = pathname === item.href;
    const linkClass = cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all motion-safe:transform-gpu hover:text-primary',
      isActive && 'bg-muted text-primary',
      item.disabled && 'cursor-not-allowed opacity-50'
    );
    const mobileLinkClass = cn(
      'flex items-center gap-4 px-2.5 text-muted-foreground motion-safe:transform-gpu hover:text-foreground',
      isActive && 'text-foreground',
      item.disabled && 'cursor-not-allowed opacity-50'
    );

    const linkContent = (
      <>
        <item.icon className="h-4 w-4 transition-transform motion-safe:duration-200 group-hover:scale-110" />
        {item.label}
      </>
    );
    
    // Hide link if it requires a role and user doesn't have it
    if (item.role && item.role !== userRole) {
        return null;
    }

    if (item.disabled) {
      return <span className={isMobile ? mobileLinkClass : linkClass}>{linkContent}</span>;
    }

    return (
      <Link href={item.href} className={isMobile ? mobileLinkClass : linkClass}>
        {/* active indicator */}
        <span className={cn('mr-2 w-1 h-6 rounded-r-md bg-transparent transition-colors', isActive && 'bg-primary')} />
        {linkContent}
      </Link>
    );
  }
  
  const allNavItems = [...navItems, ...otherItems];
  const allAdminItems = [...adminItems];

  return (
    <nav className="grid items-start text-sm font-medium">
      {isMobile ? (
        <>
            <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: {} }} className="space-y-2">
              {navItems.map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  {renderLink(item)}
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="space-y-2">
              {otherItems.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * (i + navItems.length) }}>
                  {renderLink(item)}
                </motion.div>
              ))}
            </motion.div>
            {userRole === 'admin' && <div className="my-2 border-t border-muted" />}
            {allAdminItems.map((item) => <React.Fragment key={item.href}>{renderLink(item)}</React.Fragment>)}
        </>
       ) : (
        <div className="px-4">
            <div className="px-0">
              {navItems.map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  {renderLink(item)}
                </motion.div>
              ))}
            </div>
            <h3 className="mb-2 mt-6 px-3 text-xs font-semibold text-muted-foreground/80 tracking-wider">PROYEK</h3>
            <div className="px-0">
              {otherItems.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (i + navItems.length) * 0.04 }}>
                  {renderLink(item)}
                </motion.div>
              ))}
            </div>

            {userRole === 'admin' && (
                <>
                    <h3 className="mb-2 mt-6 px-3 text-xs font-semibold text-muted-foreground/80 tracking-wider">ADMIN</h3>
                    {allAdminItems.map((item) => <React.Fragment key={item.href}>{renderLink(item)}</React.Fragment>)}
                </>
            )}
        </div>
       )}
    </nav>
  );
}
