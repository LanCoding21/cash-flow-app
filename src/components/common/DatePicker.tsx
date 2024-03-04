import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { UseFormRegister } from 'react-hook-form';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';

interface IDatePickerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  error: boolean;
  helperText: string;
  register: UseFormRegister<any>;
  onDateChange: (val?: Date) => void;
  defaultDate: Date;
}

function DatePicker(props: Partial<IDatePickerProps>) {
  const { label, className, onDateChange, defaultDate } = props;
  const [date, setDate] = useState<Date | undefined>(defaultDate);

  useEffect(() => {
    if (onDateChange) {
      if (date) {
        const copyDate = new Date(date.toISOString());
        copyDate.setDate(copyDate.getDate() + 1);
        onDateChange(copyDate);
      } else {
        onDateChange(undefined);
      }
    }
  }, [date]);

  return (
    <div className="mb-3">
      {label ? <Label className="block mb-1">{label}</Label> : null}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(val) => setDate(val)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
