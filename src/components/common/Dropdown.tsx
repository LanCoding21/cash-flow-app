import { useEffect, useState } from 'react';
import { CaretSortIcon, CheckIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';
import { Label } from '../ui/label';
import clsx from 'clsx';
import { Typography } from '.';

interface IDropdownProps<T> {
  options?: T[];
  getOptionLabel: (opt: T) => string;
  fetchData?: (searchText: string) => Promise<T[]>;
  showSearchbar?: boolean;
  getOptionValue: (opt: T) => string;
  label?: string;
  className?: string;
  onChange?: (opt?: T) => void;
  error?: boolean;
  helperText?: string;
  defaultValue?: T;
}

function Dropdown<T>(props: IDropdownProps<T>) {
  const {
    getOptionLabel,
    options,
    showSearchbar,
    getOptionValue,
    fetchData,
    label,
    className,
    onChange,
    error,
    helperText,
    defaultValue,
  } = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const [data, setData] = useState<T[]>(options ?? []);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const x = setTimeout(async () => {
      if (!fetchData) return;
      setLoading(true);
      const response = await fetchData(inputVal);
      if (!active) return;
      setTimeout(() => {
        setLoading(false);
        setData(response);
      }, 250);
    }, 1000);

    return () => {
      active = false;
      clearTimeout(x);
    };
  }, [inputVal, fetchData]);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  const isCurrentValue = (item: T) => {
    if (!value) return false;

    return getOptionValue(item) === getOptionValue(value);
  };

  return (
    <div className="mb-3">
      {label ? (
        <Label className="block mb-1" error={error}>
          {label}
        </Label>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={clsx(
              'justify-between',
              { 'border-destructive text-destructive': error },
              className,
            )}
          >
            {value ? getOptionLabel(value) : 'Select an option'}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0">
          <Command shouldFilter={!fetchData}>
            {showSearchbar ? (
              <CommandInput
                value={inputVal}
                onValueChange={(val) => setInputVal(val)}
                placeholder="Search..."
                className="h-9"
              />
            ) : null}
            <CommandGroup>
              {!fetchData ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : null}
              {fetchData && !loading && !data.length ? (
                <div className="py-6 text-center text-sm">
                  No results found.
                </div>
              ) : null}
              {!loading
                ? data.map((item) => (
                    <CommandItem
                      key={getOptionLabel(item)}
                      value={getOptionValue(item)}
                      onSelect={() => {
                        const isValue = isCurrentValue(item);
                        setValue(isValue ? undefined : item);
                        setOpen(false);
                      }}
                    >
                      {isCurrentValue(item) ? <CheckIcon /> : null}
                      {getOptionLabel(item)}
                    </CommandItem>
                  ))
                : null}
              {loading ? (
                <div className="flex justify-center items-center">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </div>
              ) : null}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {helperText ? (
        <Typography
          variant="muted"
          className={clsx({ 'text-destructive': error })}
        >
          {helperText}
        </Typography>
      ) : null}
    </div>
  );
}

export default Dropdown;
