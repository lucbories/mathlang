module NewtonGravity

SolarMassValue:FLOAT=2E+30
SolarMassUnit:STRING=kg

NewtonGravitationalConstantValue:FLOAT=6.67430E−11
NewtonGravitationalConstantUnit:STRING=m3⋅kg−1⋅s−2

pc=parsec
MS=SolarMassValue
NewtonGravitationalConstant2Value:FLOAT=4.30091E−3
NewtonGravitationalConstant2Unit:STRING=pc⋅MS−1⋅(km/s)2

function NewtonGravitationalForce(m1:FLOAT, m2:FLOAT, r:FLOAT) as FLOAT
    // unit = m3⋅kg−1⋅s−2.kg.kg/m2)
    return NewtonGravitationalConstantValue*m1*m2/r^2
end function