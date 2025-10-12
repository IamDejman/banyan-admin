"use client"

import * as React from "react"
import DatePicker from "react-datepicker"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import "react-datepicker/dist/react-datepicker.css"

interface DatePickerProps {
  selected?: Date
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  showTimeSelect?: boolean
  timeFormat?: string
  dateFormat?: string
}

export function DatePickerComponent({
  selected,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  minDate,
  maxDate,
  showTimeSelect = false,
  timeFormat = "HH:mm",
  dateFormat = "PPP"
}: DatePickerProps) {
  return (
    <div className={cn("relative", className)}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholder}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        showTimeSelect={showTimeSelect}
        timeFormat={timeFormat}
        dateFormat={dateFormat}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}
        calendarClassName="!shadow-lg !border !border-border !rounded-md"
        dayClassName={(date) =>
          cn(
            "!h-9 !w-9 !flex !items-center !justify-center !text-sm hover:!bg-accent hover:!text-accent-foreground",
            date.toDateString() === new Date().toDateString() && "!bg-accent !text-accent-foreground"
          )
        }
        wrapperClassName="w-full"
        customInput={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? (
              showTimeSelect ? 
                selected.toLocaleString() : 
                selected.toLocaleDateString()
            ) : (
              placeholder
            )}
          </Button>
        }
      />
    </div>
  )
}
