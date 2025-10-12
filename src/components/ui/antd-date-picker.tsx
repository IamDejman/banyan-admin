"use client"

import * as React from "react"
import { DatePicker } from "antd"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"

// Import Ant Design styles
import "antd/dist/reset.css"

interface AntdDatePickerProps {
  selected?: Date
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  showTime?: boolean
  format?: string
  size?: "small" | "middle" | "large"
}

export function AntdDatePickerComponent({
  selected,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  minDate,
  maxDate,
  showTime = false,
  format = "DD/MM/YYYY",
  size = "middle"
}: AntdDatePickerProps) {
  const handleChange = (date: dayjs.Dayjs | null) => {
    onChange(date ? date.toDate() : null)
  }

  return (
    <div className={cn("w-full", className)}>
      <DatePicker
        value={selected ? dayjs(selected) : null}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        disabledDate={(current) => {
          if (minDate && current.isBefore(dayjs(minDate), 'day')) {
            return true
          }
          if (maxDate && current.isAfter(dayjs(maxDate), 'day')) {
            return true
          }
          return false
        }}
        showTime={showTime}
        format={format}
        size={size}
        className="w-full"
        style={{
          width: '100%',
          height: '40px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          fontSize: '14px'
        }}
        suffixIcon={<CalendarIcon className="h-4 w-4 text-gray-500" />}
      />
    </div>
  )
}
