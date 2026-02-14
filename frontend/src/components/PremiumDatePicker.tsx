import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// Custom Input Component
const CustomInput = forwardRef(({ value, onClick, onChange, placeholder, className, showIcon = true, label }: any, ref: any) => (
  <div className="relative w-full">
    {label && (
        <span className="absolute -top-6 left-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {label}
        </span>
    )}
    <div className={`${className || 'w-full'} group relative flex items-center bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl md:rounded-2xl transition-all duration-200 hover:border-[#1F8F5F] dark:hover:border-[#CDEB8B] focus-within:border-[#1F8F5F] dark:focus-within:border-[#CDEB8B] focus-within:ring-4 focus-within:ring-[#1F8F5F]/10 dark:focus-within:ring-[#CDEB8B]/5 shadow-sm hover:shadow-lg hover:shadow-[#1F8F5F]/5`}>
        {showIcon && (
            <button
                type="button"
                onClick={onClick}
                className="pl-4 pr-2 py-3 z-20 text-slate-400 group-focus-within:text-[#1F8F5F] dark:group-focus-within:text-[#CDEB8B] transition-colors"
                title="Open Calendar"
            >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
        )}
        <input
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder="DD/MM/YYYY"
            className={`w-full ${showIcon ? 'pl-1' : 'pl-4'} pr-4 py-2.5 md:py-3 bg-transparent border-none outline-none text-xs md:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium`}
        />
    </div>
  </div>
));

interface PremiumDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  showMonthYearPicker?: boolean;
  placeholder?: string;
  className?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  showIcon?: boolean;
  label?: string;
}

const PremiumDatePicker = forwardRef<DatePicker, PremiumDatePickerProps>(({ 
  selected, 
  onChange, 
  dateFormat = "dd/MM/yyyy", 
  showMonthYearPicker = false,
  placeholder = "Select Date",
  className,
  minDate,
  maxDate,
  showIcon = true,
  label
}, ref) => {
  return (
    <div className="relative w-full">
        <style>{`
            /* --- Portal / Backdrop --- */
            .react-datepicker__portal {
                background-color: rgba(15, 23, 42, 0.4) !important; /* Dim slate */
                backdrop-filter: blur(6px) !important;
                z-index: 10002 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            /* --- Calendar Container (Mini-Modal Feel) --- */
            .react-datepicker {
                font-family: inherit;
                background-color: #ffffff !important; 
                border: none !important;
                border-radius: 2rem !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(6, 78, 72, 0.1) !important;
                overflow: hidden !important;
                padding: 0 !important;
            }

            /* --- Gradient Header --- */
            .react-datepicker__header {
                background: linear-gradient(135deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%) !important;
                border-bottom: none !important;
                padding: 1.5rem 1rem 1.25rem !important;
                border-radius: 0 !important;
            }

            .react-datepicker__current-month {
                color: white !important;
                font-weight: 900 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.15em !important;
                font-size: 0.9rem !important;
                margin-bottom: 0.75rem !important;
            }

            .react-datepicker__day-name {
                color: rgba(255, 255, 255, 0.7) !important;
                font-weight: 800 !important;
                text-transform: uppercase !important;
                font-size: 0.65rem !important;
                width: 2.5rem !important;
                margin: 0.2rem !important;
            }

            /* --- Date Grid --- */
            .react-datepicker__month {
                margin: 1.25rem !important;
                background-color: #ffffff !important;
            }

            .react-datepicker__day {
                color: #1e293b !important; /* slate-800 */
                width: 2.5rem !important;
                height: 2.5rem !important;
                line-height: 2.5rem !important;
                border-radius: 1rem !important;
                font-weight: 700 !important;
                font-size: 0.85rem !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                margin: 0.2rem !important;
            }

            /* --- Hover & Selection --- */
            .react-datepicker__day:hover {
                background-color: rgba(37, 167, 86, 0.1) !important; /* Light green tint */
                color: #0E5A4E !important;
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 4px 12px rgba(37, 167, 86, 0.15) !important;
            }

            .react-datepicker__day--selected, 
            .react-datepicker__day--keyboard-selected {
                background: linear-gradient(135deg, #0E5A4E 0%, #25A756 100%) !important;
                color: white !important;
                font-weight: 900 !important;
                box-shadow: 0 8px 15px rgba(14, 90, 78, 0.3) !important;
                transform: translateY(-2px) !important;
            }

            .react-datepicker__day--today {
                border: 2px solid #25A756 !important;
                color: #0E5A4E !important;
                font-weight: 800 !important;
            }

            .react-datepicker__day--outside-month {
                color: #cbd5e1 !important; /* slate-300 */
                opacity: 0.5;
            }

            /* --- Navigation --- */
            .react-datepicker__navigation {
                top: 1.25rem !important;
            }
            .react-datepicker__navigation--previous {
                left: 1rem !important;
            }
            .react-datepicker__navigation--next {
                right: 1rem !important;
            }
            .react-datepicker__navigation-icon::before {
                border-color: white !important;
                border-width: 2px 2px 0 0 !important;
            }

            .react-datepicker__triangle {
                display: none !important;
            }
        `}</style>
        
        <DatePicker
            ref={ref}
            selected={selected}
            onChange={onChange}
            customInput={<CustomInput placeholder={placeholder} className={className} showIcon={showIcon} label={label} />}
            dateFormat={dateFormat}
            showMonthYearPicker={showMonthYearPicker}
            minDate={minDate}
            maxDate={maxDate}
            dropdownMode="select"
            calendarClassName="premium-calendar"
            withPortal
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={15}
            isClearable
            strictParsing
            placeholderText="DD/MM/YYYY"
            renderCustomHeader={({
                date: headerDate,
                changeYear,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
            }) => {
                const date = new Date(headerDate);
                const years = Array.from({ length: 41 }, (_, i) => 1990 + i);
                return (
                    <div className="flex items-center justify-between px-2 mb-4">
                        <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="p-1.5 hover:bg-white/20 rounded-full transition-all text-white active:scale-90">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-white uppercase tracking-wider">
                                {date.toLocaleString('default', { month: 'long' })}
                            </span>
                            <div className="relative group/year">
                                <select 
                                    value={date.getFullYear()} 
                                    onChange={({ target: { value } }) => changeYear(Number(value))}
                                    className="bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl text-sm font-black text-white border border-white/10 outline-none cursor-pointer transition-all appearance-none pr-8"
                                    style={{ textAlignLast: 'center' }}
                                >
                                    {years.map((option) => (
                                        <option key={option} value={option} className="bg-slate-900 text-white font-bold py-2">
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/70 pointer-events-none group-hover/year:text-white transition-colors" />
                            </div>
                        </div>

                        <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="p-1.5 hover:bg-white/20 rounded-full transition-all text-white active:scale-90">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                );
            }}
        />
    </div>
  );
});

export default PremiumDatePicker;