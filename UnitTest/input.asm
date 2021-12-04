cal &[!first]
start:
mov &[((0x1+0x1)-0x1)*0x3],r2
inc r1
hlt

first:
cal &[!first]
add r1,r2
ret

second:
cal &[!first]
add r1,r2
add r1,r2
add r1,r2
add r1,r2
ret