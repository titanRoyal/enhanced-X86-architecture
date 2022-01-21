ascii pN="primary number"
ascii npN="not primary number"

mov 0x9,R1
cal &[!primary]
hlt

primary:
; set R2 as counter init with 2
mov 0x2,R2
; set R3 as the floor div of R1 by 2
div R1,0x2
mov acc,R3

loopStart:
mov R3,acc
jge R2,&[!loopEnd]
mod R1,R2
jeq 0x0,&[!found]
inc R2
jmp &[!loopStart]

loopEnd:
mov [!pN],DATA
int 0x0
ret

found:
mov [!npN],DATA
int 0x0
ret