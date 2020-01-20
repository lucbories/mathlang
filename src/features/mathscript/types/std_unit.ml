module std

type UNIT
    is_scalar = true
    is_textual = false
    is_collection = false
    name is STRING
    base_unit is UNIT
    base_ratio is FLOAT
end type

export function NewUnit(name:STRING,base_unit:UNIT,base_ratio:FLOAT) as UNIT
    u=New('UNIT')
    u#name=name
    u#base_unit=base_unit
    u#base_ratio=base_ratio
    return u
end function



use std

type QUANTITY
    is_scalar = true
    is_textual = false
    is_collection = false
    unit is std@UNIT
    value is FLOAT

    to_base_unit() = NewQuantity(qty#unit#base_unit,qty#value*qty#unit#base_ratio)
    new(unit:std@UNIT,value:FLOAT) = NewQuantity(unit:std@UNIT,value:FLOAT)
    new_by_name(unit_name:STRING,value:FLOAT) =  NewQuantityByUnitName(unit_name:STRING,value:FLOAT)
end type


export function NewQuantity(unit:std@UNIT,value:FLOAT) as std@QUANTITY
    qty = New('std@QUANTITY')
    qty.unit = unit
    qty.value = value
end function

export function NewQuantityByUnitName(unit_name:STRING,value:FLOAT) as std@QUANTITY
    qty = New('std@QUANTITY')
    qty.unit = std@lookup_unit('unit_name)
    qty.value = value
end function

export function to_base_unit(qty is std@QUANTITY) as std@QUANTITY
    return  end if
    if (qty.unit.name == 'meter') return qty end if
    if (qty.unit.name == 'meter') return qty end if
    if (qty.unit.name == 'meter') return qty end if
end function
export function to_meter(qty is std@QUANTITY) as std@QUANTITY
    if (qty.unit.name == 'meter') return qty end if
    if (qty.unit.name == 'centimeter') return NewQuantityByUnitName('meter',qty.value/100) end if
    if (qty.unit.name == 'meter') return qty end if
    if (qty.unit.name == 'meter') return qty end if
    if (qty.unit.name == 'meter') return qty end if
end function