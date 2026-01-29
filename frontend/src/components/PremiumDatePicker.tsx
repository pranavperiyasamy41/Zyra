import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// Custom Input Component to trigger the calendar
const CustomInput = forwardRef(({ value, onClick, placeholder, className, showIcon = true, label }: any, ref: any) => (
  <button 
    onClick={onClick} 
    ref={ref}
    className={`${className || "px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 bg-slate-100 text-slate-500 hover:bg-slate-200"} group`}
  >
    {showIcon && <Calendar className="w-3.5 h-3.5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" />} 
    {label && <span className="whitespace-nowrap">{label}</span>}
    {value || placeholder}
  </button>
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
  dateFormat = "MMM d, yyyy", 
  showMonthYearPicker = false,
  placeholder = "Select Date",
  className,
  minDate,
  maxDate,
  showIcon = true,
  label
}, ref) => {
  return (
    <div className="relative">
        <style>{`
            .react-datepicker {
                font-family: inherit;
                background-color: rgba(30, 41, 59, 0.95) !important; /* slate-900 */
                backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 1.5rem !important;
                padding: 1rem !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
                color: white !important;
            }
            .react-datepicker__header {
                background-color: transparent !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                padding-bottom: 1rem !important;
            }
            .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker__year-header {
                color: white !important;
                font-weight: 800 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.05em !important;
                font-size: 0.8rem !important;
            }
            .react-datepicker__day-name {
                color: #94a3b8 !important; /* slate-400 */
                font-weight: 700 !important;
                text-transform: uppercase !important;
                font-size: 0.65rem !important;
                width: 2rem !important;
            }
            .react-datepicker__day {
                color: #e2e8f0 !important; /* slate-200 */
                width: 2rem !important;
                height: 2rem !important;
                line-height: 2rem !important;
                border-radius: 9999px !important;
                font-weight: 600 !important;
                font-size: 0.8rem !important;
                transition: all 0.2s !important;
            }
            .react-datepicker__day:hover {
                background-color: rgba(59, 130, 246, 0.5) !important;
                color: white !important;
            }
            .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
                background-color: #2563eb !important; /* blue-600 */
                color: white !important;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4) !important;
            }
            .react-datepicker__day--outside-month {
                color: #475569 !important;
            }
            .react-datepicker__month-text {
                color: white !important;
                font-weight: 600 !important;
                padding: 5px !important;
                border-radius: 0.5rem !important;
            }
            .react-datepicker__month-text:hover {
                background-color: rgba(59, 130, 246, 0.5) !important;
            }
            .react-datepicker__month-text--selected {
                background-color: #2563eb !important;
            }
            .react-datepicker__navigation-icon::before {
                border-color: #94a3b8 !important;
            }
            .react-datepicker__triangle {
                display: none !important;
            }
            .react-datepicker-popper {
                z-index: 9999 !important;
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
            popperPlacement="bottom-start"
            popperModifiers={[
                {
                    name: "offset",
                    options: {
                        offset: [0, 12],
                    },
                },
            ]}
            renderCustomHeader={({
                date,
                changeYear,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
            }) => {
                const years = Array.from({ length: 41 }, (_, i) => 1990 + i); // 1990 to 2030
                return (
                    <div className="flex items-center justify-between px-2 mb-4">
                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white uppercase tracking-wider">
                                {date.toLocaleString('default', { month: 'long' })}
                            </span>
                            <select 
                                value={date.getFullYear()} 
                                onChange={({ target: { value } }) => changeYear(Number(value))}
                                className="bg-transparent text-sm font-black text-white border-none outline-none cursor-pointer hover:text-blue-400 transition-colors appearance-none"
                                style={{ textAlignLast: 'center' }}
                            >
                                {years.map((option) => (
                                    <option key={option} value={option} className="text-slate-900">
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                );
            }}
        />
    </div>
  );
});

export default PremiumDatePicker;