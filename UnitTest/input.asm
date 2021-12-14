start:
jmp &[!mid]
mov 0x1,r1
mov 0x2,r2
mid:
mov 0x99,r2
cal &[!first]
hlt



first:
lsh r1,r2
ret
