##actual value in the r1 register
mov 0x4,r1
cal &[!primary]
hlt

primary:
## counter r2 register
mov 0x2,r2
mov 0x2,r2
mov 0x2,r2
mov 0x2,r2
mov 0x2,r2

loopStart:
mov r1,acc
jge r2,&[!loopEnd]
mod r1,r2
jeq 0x0,&[!found]

inc r2
jmp &[!loopStart]

loopEnd:
mov 0x1,DATA
ret

found:
mov 0x0,DATA
ret
