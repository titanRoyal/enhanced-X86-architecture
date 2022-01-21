ascii pn="this number is perfect Number."
ascii npn="this number is not perfect Number."
ascii hello="enter your number:"


mov [!hello],DATA
int 0x0
int 0x3
mov DATA,R1
cal &[!perfect]
hlt

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
mov R4,ACC
jgt R2,&[!loopEnd]
mod R1,R2
jeq 0x0,&[!addNum]
jmp &[!loopStart]
loopEnd:
mov R3,ACC
jeq R1,&[!found]
mov [!npn],DATA
int 0x0
ret

addNum:
add R2,R3
mov ACC,R3
jmp &[!loopStart]

found:
mov [!pn],DATA
int 0x0
ret
