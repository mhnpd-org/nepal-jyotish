"use client";

import React from 'react';
import {useForm} from 'react-hook-form';
import {formatInTimeZone} from 'date-fns-tz';
import { useI18n } from '@internal/lib/i18n';
import { listTimeZones } from 'timezone-support';

type FormValues = {
  name?: string;
  datetime: string; // HTML datetime-local value: YYYY-MM-DDTHH:mm
  latitude: string;
  longitude: string;
  place?: string;
  timezone: string;
};

// Assumptions: The user asked the form to be prefilled with Kathmandu/Nepal
// current date & time as default and lat/lon for Kathmandu. We'll use the
// Asia/Kathmandu tz and common Kathmandu coordinates (lat 27.7172, lon 85.3240).

export default function JanmaPage() {
  const kathmanduTz = 'Asia/Kathmandu';
  const defaultDatetime = formatInTimeZone(new Date(), kathmanduTz, "yyyy-MM-dd'T'HH:mm");
  const defaultLatitude = '27.7172';
  const defaultLongitude = '85.3240';

  const {register, handleSubmit, formState: {errors}, reset, setValue} = useForm<FormValues>({
    defaultValues: {
      name: '',
      datetime: defaultDatetime,
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      place: 'Kathmandu, Nepal',
      timezone: kathmanduTz,
    },
  });

  // Use timezone-support to get a canonical list of IANA time zones and
  // show a Tailwind-styled searchable dropdown. We'll integrate with
  // react-hook-form by updating the hidden registered input when selection
  // changes.
  // local state for timezone list and filter
  const [timezones, setTimezones] = React.useState<string[]>([]);
  const [filter, setFilter] = React.useState('');
  const [selectedTz, setSelectedTz] = React.useState<string>(kathmanduTz);
  const [open, setOpen] = React.useState(false);

  // Keep the form's datetime in-sync with the current kathmandu time on mount
  // so it always prefills with the current time when the page is opened.
  React.useEffect(() => {
    // populate timezones
    try {
      const tzs = listTimeZones();
      setTimezones(tzs as string[]);
    } catch {
      setTimezones([kathmanduTz]);
    }

    reset({
      datetime: formatInTimeZone(new Date(), kathmanduTz, "yyyy-MM-dd'T'HH:mm"),
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      place: 'Kathmandu, Nepal',
      timezone: kathmanduTz,
    });
    // ensure react-hook-form value is in sync
    setValue('timezone', kathmanduTz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: FormValues) => {
    // For now just log the collected values. Future: call an API to compute charts.
    // Convert strings to numbers where appropriate when sending to an API.
    console.log('Janma form submitted', data);
    alert('Submitted — check console for values');
  };

  const { t: translate } = useI18n();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-2">{translate('janma.title')}</h2>
        <p className="text-sm text-slate-600 mb-4">{translate('janma.description')}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">{translate('janma.name')}</label>
            <input {...register('name')} className="mt-1 block w-full rounded-md border-slate-200 shadow-sm p-2" placeholder="Name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">{translate('janma.datetime')}</label>
            <input
              {...register('datetime', {required: true})}
              type="datetime-local"
              className="mt-1 block w-full rounded-md border-slate-200 shadow-sm p-2"
            />
            {errors.datetime && <p className="text-xs text-red-500">{translate('janma.datetime_required')}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">{translate('janma.timezone')}</label>
            <div className="mt-1">
              <div className="relative">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  onBlur={() => {
                    // small timeout so option click can register before we close
                    setTimeout(() => setOpen(false), 150);
                  }}
                  placeholder="Search or pick a timezone"
                  className="mb-2 block w-full rounded-md border-slate-200 shadow-sm p-2"
                  aria-label="Timezone"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const matches = timezones.filter(tz => tz.toLowerCase().includes((filter || selectedTz).toLowerCase()));
                      if (matches.length > 0) {
                        const v = matches[0];
                        setSelectedTz(v);
                        setFilter(v);
                        setValue('timezone', v);
                        setOpen(false);
                      }
                    }
                  }}
                />

                {open && (
                  <ul className="absolute z-20 left-0 right-0 max-h-60 overflow-auto bg-white border rounded-md shadow mt-1 text-sm">
                    {timezones
                      .filter(tz => tz.toLowerCase().includes((filter || '').toLowerCase()))
                      .slice(0, 200)
                      .map(tz => (
                        <li
                          key={tz}
                          onMouseDown={(ev) => {
                            // use onMouseDown so it fires before blur
                            ev.preventDefault();
                            setSelectedTz(tz);
                            setFilter(tz);
                            setValue('timezone', tz);
                            setOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                        >
                          {tz}
                        </li>
                      ))}
                  </ul>
                )}

                {/* Hidden input to keep react-hook-form registered value in sync */}
                <input type="hidden" value={selectedTz} {...register('timezone')} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">{translate('janma.latitude')}</label>
            <input
              {...register('latitude', {required: true})}
              className="mt-1 block w-full rounded-md border-slate-200 shadow-sm p-2"
            />
            {errors.latitude && <p className="text-xs text-red-500">{translate('janma.lat_required')}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">{translate('janma.longitude')}</label>
            <input
              {...register('longitude', {required: true})}
              className="mt-1 block w-full rounded-md border-slate-200 shadow-sm p-2"
            />
            {errors.longitude && <p className="text-xs text-red-500">{translate('janma.lon_required')}</p>}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">{translate('janma.place')}</label>
            <input {...register('place')} className="mt-1 block w-full rounded-md border-slate-200 shadow-sm p-2" />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-md border bg-white text-slate-700 hover:bg-slate-50"
            >
              {translate('janma.reset')}
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-amber-700 text-white hover:bg-amber-800">{translate('janma.compute')}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 
