mov 0x3,R1
cal &[!perfect]

perfect:
; set R2 as the counter
mov 0x1,R2
; set R3 as the accumulator
mov 0x1,R3
; set the Mid point as the R4 register
div R1,0x2
mov ACC,R4
loopStart:
inc R2
mov R2,ACC
jge R4,&[!loopEnd]
mod R1,R2
jeq 0x0,&[!addNum]
jmp &[!loopStart]
LoopEnd:
mov R3,ACC
jeq R1,&[!found]
mov 0x0,DATA
ret

addNum:
add R2,R3
jmp &[!loopStart]

found:
mov 0x1,DATA
ret
