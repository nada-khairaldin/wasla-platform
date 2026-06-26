// components/profile/ProfileHeader.tsx
import { Pencil } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  title: string;
  bio: string;
  offeredSkills: string[];
  requiredSkills: string[];
  avatarUrl?: string;
  onEditClick?: () => void;
  isEmpty?: boolean;
}

export default function ProfileHeader(props: ProfileHeaderProps) {
  const { name, title, bio, offeredSkills, requiredSkills, avatarUrl, onEditClick, isEmpty } = props;

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-neutral-100 p-4 sm:p-6 h-full" dir="rtl">
      {/* Top row: avatar + edit button — Mirrored order: Content on the right, Avatar on the left */}
      <div className="flex items-start gap-3 sm:gap-4">
        
        {/* Avatar (right side) */}
        <div className="relative shrink-0">
          {isEmpty ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                <circle cx="19" cy="19" r="5" className="fill-secondary-500" />
                <path d="M19 17v4M17 19h4" className="stroke-primary-500" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          ) : avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
              {name?.charAt(0) || "م"}
            </div>
          )}
          <button
            onClick={onEditClick}
            className="absolute -top-1 -right-1 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors border border-neutral-100"
          >
            <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-600" />
          </button>
        </div>

        {/* Content (left side) */}
        <div className="flex-1 min-w-0">
          {/* Name row with edit button — Text on the right, Edit button on the left */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 text-right">
              {isEmpty ? (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold text-primary-500">مرحباً بك!</h1>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">لم تقم بإضافة اسمك أو نبذة عنك بعد...</p>
                </>
              ) : (
                <>
                  <h1 className="text-lg sm:text-xl font-bold text-primary-500 truncate">{name}</h1>
                  <p className="text-neutral-400 text-xs sm:text-sm truncate">{title}</p>
                </>
              )}
            </div>

            {!isEmpty && (
              <button
                onClick={onEditClick}
                className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 border border-neutral-200 text-neutral-600 rounded-full text-xs sm:text-sm hover:bg-neutral-50 hover:text-neutral-800 transition-colors whitespace-nowrap"
              >
                تعديل الملف
              </button>
            )}
          </div>

          {/* Bio — hidden on very small, visible sm+ */}
          {!isEmpty && (
            <div className="hidden sm:block">
              {bio ? (
                <p className="text-neutral-600 text-sm mt-2 leading-relaxed line-clamp-3">
                  {bio}
                </p>
              ) : (
                <p 
                  className="text-neutral-400 text-sm mt-2 leading-relaxed italic cursor-pointer hover:text-primary-500 transition-colors" 
                  onClick={onEditClick}
                >
                  لا توجد نبذة شخصية حتى الآن. أضف نبذة تعريفية قصيرة لتخبر المجتمع بمهاراتك واهتماماتك وتبدأ في بناء شبكة تبادلاتك! (اضغط هنا للإضافة)
                </p>
              )}
            </div>
          )}

          {/* Skills chips */}
          {!isEmpty && (
            <div className="mt-2 sm:mt-3 flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {offeredSkills?.map((skill) => (
                  <span
                    key={`offered-${skill}`}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {requiredSkills?.map((skill) => (
                  <span
                    key={`required-${skill}`}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary-50 text-primary-700 text-xs"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA for empty state */}
          {isEmpty && (
            <a
              href="#"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 sm:px-4 sm:py-2 border border-primary-500 text-primary-500 rounded-full text-xs sm:text-sm hover:bg-primary-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              <span className="hidden xs:inline">ابدأ أول عملية تبادل لبناء ملفك الشخصي</span>
              <span className="xs:hidden">ابدأ الآن</span>
            </a>
          )}
        </div>

      </div>

      {/* Bio on mobile (below avatar row) */}
      {!isEmpty && (
        <div className="sm:hidden mt-3">
          {bio ? (
            <p className="text-neutral-600 text-sm leading-relaxed">{bio}</p>
          ) : (
            <p 
              className="text-neutral-400 text-xs leading-relaxed italic cursor-pointer hover:text-primary-500 transition-colors" 
              onClick={onEditClick}
            >
              لا توجد نبذة شخصية حتى الآن. اضغط هنا لإضافة نبذة تعريفية قصيرة والتعريف بمهاراتك!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
