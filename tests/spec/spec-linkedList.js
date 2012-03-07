define(['src/other/LinkedList'], function (LinkedList) {

    describe('other/LinkedList', function () {

        it('append() should add new items to the list', function () {
            var ll = new LinkedList();
            expect( ll.size() ).toEqual( 0 );
            expect( ll.hasNext() ).toBe( false );
            ll.append('lorem');
            ll.append('ipsum');
            ll.append('dolor');
            expect( ll.size() ).toEqual( 3 );
            expect( ll.hasNext() ).toBe( true );
            expect( ll.next() ).toEqual( 'lorem' );
        });

        it('prepend() should add new items to begin of the list', function () {
            var ll = new LinkedList();
            expect( ll.size() ).toEqual( 0 );
            expect( ll.hasNext() ).toBe( false );
            ll.prepend('lorem');
            ll.prepend('ipsum');
            ll.prepend('dolor');
            expect( ll.size() ).toEqual( 3 );
            expect( ll.hasNext() ).toBe( true );
            expect( ll.next() ).toEqual( 'dolor' );
        });

        describe('iterator', function () {

            it('should loop though all items and rewind pointer', function () {
                var ll = new LinkedList();
                ll.append('lorem');
                ll.append('ipsum');
                ll.append('dolor');
                var items = [];
                while (ll.hasNext()) {
                    items.push(ll.next());
                }
                expect(items).toEqual(['lorem', 'ipsum', 'dolor']);
                var items2 = [];
                ll.rewind();
                while (ll.hasNext()) {
                    items2.push(ll.next());
                }
                expect(items2).toEqual(items);
            });

            it('insert shouldn\'t break iterator', function () {
                var ll = new LinkedList();
                ll.append('lorem');
                ll.append('ipsum');
                ll.append('dolor');
                ll.insert('foo', function(){
                    return false;
                });
                ll.insert('bar', function(){
                    return true;
                });
                var items = [];
                while (ll.hasNext()) {
                    items.push(ll.next());
                }
                expect(items).toEqual(['bar', 'lorem', 'ipsum', 'dolor', 'foo']);
                var items2 = [];
                ll.rewind();
                while (ll.hasNext()) {
                    items2.push(ll.next());
                }
                expect(items2).toEqual(items);
            });

        });

        describe('remove/insert', function () {

            it('should remove item from list and update links', function () {
                var ll = new LinkedList();
                ll.append('lorem');
                ll.append('ipsum');
                ll.append('dolor');

                ll.remove('ipsum');

                var items = [];
                while (ll.hasNext()) {
                    items.push(ll.next());
                }
                expect(items).toEqual(['lorem', 'dolor']);
            });

            it('should remove all items from list', function () {
                var ll = new LinkedList();
                ll.append('lorem');
                ll.append('ipsum');
                ll.append('dolor');

                expect( ll.size() ).toEqual( 3 );

                ll.removeAll();

                expect( ll.size() ).toEqual( 0 );

                var items = [];
                while (ll.hasNext()) {
                    items.push(ll.next());
                }
                expect(items).toEqual([]);
            });

            it('should insert item based on compare function', function () {
                var ll = new LinkedList();
                ll.append(1);
                ll.append(3);
                ll.append(4);
                ll.insert(2, function(itemInList, adding){
                    return itemInList > adding;
                });
                var items = [];
                while (ll.hasNext()) {
                    items.push(ll.next());
                }
                expect(items).toEqual([1,2,3,4]);
            });

            it('should append item if compare function returns false for all items', function () {
                var ll = new LinkedList();
                ll.append(1);
                ll.append(3);
                ll.append(4);
                ll.insert(2, function(itemInList, adding){
                    return false;
                });
                var items = [];
                while (ll.hasNext()) {
                    items.push(ll.next());
                }
                expect(items).toEqual([1,3,4,2]);
            });

        });


    });

});
