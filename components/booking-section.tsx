'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Phone, MessageCircle } from 'lucide-react'

interface BookingSelection {
  type: 'tempo' | '411cc' | '450cc'
  riding?: 'solo' | 'dual'
  quantity: number
}

interface Prices {
  tempo: { double: number; triple: number }
  '411cc': { solo: { double: number; triple: number }; dual: { double: number; triple: number } }
  '450cc': { solo: { double: number; triple: number }; dual: { double: number; triple: number } }
}

interface BookingSectionProps {
  onBookingClick?: () => void
  prices?: Prices
}

const DEFAULT_PRICES: Prices = {
  tempo: { double: 41000, triple: 35000 },
  '411cc': {
    solo: { double: 45000, triple: 40000 },
    dual: { double: 35000, triple: 30000 }
  },
  '450cc': {
    solo: { double: 50000, triple: 45000 },
    dual: { double: 40000, triple: 35000 }
  }
}

export function BookingSection({ onBookingClick, prices = DEFAULT_PRICES }: BookingSectionProps) {
  const [occupancy, setOccupancy] = useState<'double' | 'triple'>('double')
  const [selections, setSelections] = useState<BookingSelection[]>([])

  const addSelection = (type: 'tempo' | '411cc' | '450cc', riding?: 'solo' | 'dual') => {
    setSelections(prev => [...prev, { type, riding, quantity: 1 }])
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return
    setSelections(prev => prev.map((s, i) => i === index ? { ...s, quantity } : s))
  }

  const removeSelection = (index: number) => {
    setSelections(prev => prev.filter((_, i) => i !== index))
  }

  const getPrice = (selection: BookingSelection) => {
    if (selection.type === 'tempo') {
      return prices.tempo[occupancy]
    } else {
      return prices[selection.type][selection.riding!][occupancy]
    }
  }

  const total = selections.reduce((sum, s) => sum + getPrice(s) * s.quantity, 0)

  const tempoIndex = selections.findIndex(s => s.type === 'tempo')
  const bike411SoloIndex = selections.findIndex(s => s.type === '411cc' && s.riding === 'solo')
  const bike411DualIndex = selections.findIndex(s => s.type === '411cc' && s.riding === 'dual')
  const bike450SoloIndex = selections.findIndex(s => s.type === '450cc' && s.riding === 'solo')
  const bike450DualIndex = selections.findIndex(s => s.type === '450cc' && s.riding === 'dual')

  return (
    <section id="booking">
      <h2 className="text-2xl font-bold mb-4">Book Your Trip</h2>
      <Card className="p-6 space-y-6">
        <div>
          <p className="text-slate-700 leading-relaxed">
            Choose between tempo traveller and bike options, then select your preferred occupancy and riding style. The total below updates with your selections.
          </p>
        </div>

        <div>
          <Label className="text-base font-semibold">Select Occupancy Type</Label>
          <RadioGroup value={occupancy} onValueChange={(v) => setOccupancy(v as 'double' | 'triple')} className="mt-3 space-y-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-3">
                <RadioGroupItem value="double" id="double" />
                <Label htmlFor="double" className="cursor-pointer">Double Sharing</Label>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-3">
                <RadioGroupItem value="triple" id="triple" />
                <Label htmlFor="triple" className="cursor-pointer">Triple Sharing</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50">
          <table className="min-w-full text-left divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-4 text-sm font-semibold text-slate-700">Travel Option</th>
                <th className="px-4 py-4 text-sm font-semibold text-slate-700">Occupancy</th>
                <th className="px-4 py-4 text-sm font-semibold text-slate-700">Price</th>
                <th className="px-4 py-4 text-sm font-semibold text-slate-700">Qty</th>
                <th className="px-4 py-4 text-sm font-semibold text-slate-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-white hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-semibold">Tempo Traveller</div>
                  <div className="text-sm text-slate-500">Volvo Bus / Group seat</div>
                </td>
                <td className="px-4 py-4 text-slate-700">{occupancy === 'double' ? 'Double Sharing' : 'Triple Sharing'}</td>
                <td className="px-4 py-4 text-slate-900 font-semibold">₹{prices.tempo[occupancy].toLocaleString()}</td>
                <td className="px-4 py-4">
                  {tempoIndex !== -1 ? (
                    <Input
                      type="number"
                      min="1"
                      value={selections[tempoIndex].quantity}
                      onChange={(e) => updateQuantity(tempoIndex, parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  {tempoIndex !== -1 ? (
                    <Button variant="destructive" size="sm" onClick={() => removeSelection(tempoIndex)}>Remove</Button>
                  ) : (
                    <Button size="sm" onClick={() => addSelection('tempo')}>Add</Button>
                  )}
                </td>
              </tr>
              <tr className="bg-white hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-semibold">Himalayan 411cc</div>
                  <div className="text-sm text-slate-500">Bike Solo / Dual Rider</div>
                </td>
                <td className="px-4 py-4 text-slate-700">{occupancy === 'double' ? 'Double Sharing' : 'Triple Sharing'}</td>
                <td className="px-4 py-4 text-slate-900 font-semibold">Solo ₹{prices['411cc'].solo[occupancy].toLocaleString()} / Dual ₹{prices['411cc'].dual[occupancy].toLocaleString()}</td>
                <td className="px-4 py-4 grid gap-2">
                  {bike411SoloIndex !== -1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Solo</span>
                      <Input
                        type="number"
                        min="1"
                        value={selections[bike411SoloIndex].quantity}
                        onChange={(e) => updateQuantity(bike411SoloIndex, parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                    </div>
                  )}
                  {bike411DualIndex !== -1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Dual</span>
                      <Input
                        type="number"
                        min="1"
                        value={selections[bike411DualIndex].quantity}
                        onChange={(e) => updateQuantity(bike411DualIndex, parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                    </div>
                  )}
                  {bike411SoloIndex === -1 && bike411DualIndex === -1 && <span className="text-slate-500">—</span>}
                </td>
                <td className="px-4 py-4 text-center space-y-2">
                  {bike411SoloIndex !== -1 ? (
                    <Button variant="destructive" size="sm" onClick={() => removeSelection(bike411SoloIndex)}>Remove Solo</Button>
                  ) : (
                    <Button size="sm" onClick={() => addSelection('411cc', 'solo')}>Add Solo</Button>
                  )}
                  {bike411DualIndex !== -1 ? (
                    <Button variant="destructive" size="sm" onClick={() => removeSelection(bike411DualIndex)}>Remove Dual</Button>
                  ) : (
                    <Button size="sm" onClick={() => addSelection('411cc', 'dual')}>Add Dual</Button>
                  )}
                </td>
              </tr>
              <tr className="bg-white hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-semibold">Himalayan 450cc</div>
                  <div className="text-sm text-slate-500">Bike Solo / Dual Rider</div>
                </td>
                <td className="px-4 py-4 text-slate-700">{occupancy === 'double' ? 'Double Sharing' : 'Triple Sharing'}</td>
                <td className="px-4 py-4 text-slate-900 font-semibold">Solo ₹{prices['450cc'].solo[occupancy].toLocaleString()} / Dual ₹{prices['450cc'].dual[occupancy].toLocaleString()}</td>
                <td className="px-4 py-4 grid gap-2">
                  {bike450SoloIndex !== -1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Solo</span>
                      <Input
                        type="number"
                        min="1"
                        value={selections[bike450SoloIndex].quantity}
                        onChange={(e) => updateQuantity(bike450SoloIndex, parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                    </div>
                  )}
                  {bike450DualIndex !== -1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Dual</span>
                      <Input
                        type="number"
                        min="1"
                        value={selections[bike450DualIndex].quantity}
                        onChange={(e) => updateQuantity(bike450DualIndex, parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                    </div>
                  )}
                  {bike450SoloIndex === -1 && bike450DualIndex === -1 && <span className="text-slate-500">—</span>}
                </td>
                <td className="px-4 py-4 text-center space-y-2">
                  {bike450SoloIndex !== -1 ? (
                    <Button variant="destructive" size="sm" onClick={() => removeSelection(bike450SoloIndex)}>Remove Solo</Button>
                  ) : (
                    <Button size="sm" onClick={() => addSelection('450cc', 'solo')}>Add Solo</Button>
                  )}
                  {bike450DualIndex !== -1 ? (
                    <Button variant="destructive" size="sm" onClick={() => removeSelection(bike450DualIndex)}>Remove Dual</Button>
                  ) : (
                    <Button size="sm" onClick={() => addSelection('450cc', 'dual')}>Add Dual</Button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Current Selection</p>
                <p className="text-2xl font-semibold mt-2">₹{total.toLocaleString()}</p>
                <p className="text-sm text-slate-500">{selections.length > 0 ? `Items: ${selections.length}` : 'Select a package option above'}</p>
              </div>
              <Button size="lg" onClick={onBookingClick} disabled={selections.length === 0}>
                Book Now
              </Button>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Note: The booking summary above updates as you add or remove options.
          </p>
        </div>
      </Card>
    </section>
  )
}
